// server.js

const Stream = require('node-rtsp-stream-jsmpeg');
const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors())

let stream;

app.get('/start-stream', (req, res) => {
    console.log(req.query);
    const { address, username, password } = req.query;
    const streamUrl = `rtsp://${username}:${password}@${address}`;

    if (stream) {
        stream.stop();
    }

    stream = new Stream({
        name: 'camera-stream',
        streamUrl: streamUrl,
        wsPort: 9999,
        ffmpegOptions: {
            '-stats': '',
            '-r': 30
        }
    });

    res.send('Stream started');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Stream = require('node-rtsp-stream')
// stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://username:password@172.16.3.18:554',
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30 // options with required values specify the value after the key
//   }
// })