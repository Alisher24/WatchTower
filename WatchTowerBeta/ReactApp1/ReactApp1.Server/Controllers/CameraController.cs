using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("stream")]
    public class CameraController : ControllerBase
    {
        private readonly ILogger<CameraController> _logger;
        private static Process _ffmpegProcess;

        public CameraController(ILogger<CameraController> logger)
        {
            _logger = logger;
        }

        [HttpGet("start-stream")]
        public IActionResult StartStream([FromQuery] string address, [FromQuery] string username, [FromQuery] string password)
        {
            var streamUrl = $"rtsp://{username}:{password}@{address}";
            _logger.LogInformation("Received request to start stream with URL: {StreamUrl}", streamUrl);

            if (_ffmpegProcess != null && !_ffmpegProcess.HasExited)
            {
                _logger.LogInformation("Stopping existing FFmpeg process.");
                _ffmpegProcess.Kill();
            }

            var ffmpegPath = "C:\\Users\\katie\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.0.1-full_build\\bin\\ffmpeg.exe";
            var arguments = $"-i {streamUrl} -f mpegts -codec:v mpeg1video -s 640x480 -b:v 800k -r 30 pipe:1";
            _logger.LogInformation("Starting FFmpeg process with arguments: {Arguments}", arguments);

            _ffmpegProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = ffmpegPath,
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            _ffmpegProcess.Start();
            _logger.LogInformation("FFmpeg process started.");

            return Ok("Stream started");
        }

        [HttpGet("stop-stream")]
        public IActionResult StopStream()
        {
            if (_ffmpegProcess != null && !_ffmpegProcess.HasExited)
            {
                _ffmpegProcess.Kill();
                _logger.LogInformation("FFmpeg process stopped.");
                return Ok("Stream stopped");
            }

            return BadRequest("No stream to stop.");
        }

        public static Stream GetStream()
        {
            return _ffmpegProcess?.StandardOutput.BaseStream;
        }

        private void LogIfText(string data)
        {
            if (!string.IsNullOrEmpty(data) && !IsBinaryData(data))
            {
                string logData = data.Length > 200 ? data.Substring(0, 200) + "..." : data;
                _logger.LogInformation(logData);
            }
        }

        private bool IsBinaryData(string data)
        {
            foreach (char c in data)
            {
                if (char.IsControl(c) && c != '\r' && c != '\n' && c != '\t')
                {
                    return true;
                }
            }
            return false;
        }
    }
}
