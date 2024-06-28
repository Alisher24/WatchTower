const form = document.getElementById('connectForm');
const remoteVideo = document.getElementById('remoteVideo');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const address = document.getElementById('address').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`http://localhost:3000/start-stream?address=${encodeURIComponent(address)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        .then(response => response.text())
        .then(message => {
            console.log(message);
            startVideoStream();
        })
        .catch(error => {
            console.error('Ошибка подключения к камере:', error);
        });
});

// function startVideoStream() {
//     const wsUrl = 'ws://localhost:9999';
//     const videoElement = document.getElementById('remoteVideo');

//     const ws = new WebSocket(wsUrl);
//     ws.binaryType = 'arraybuffer';

//     ws.onmessage = function(event) {
//         const arrayBuffer = event.data;
//         const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
//         const url = URL.createObjectURL(blob);
//         videoElement.src = url;
//     };

//     ws.onerror = function(error) {
//         console.error('WebSocket error:', error);
//     };

//     ws.onclose = function() {
//         console.log('WebSocket connection closed');
//     };
// }
// function startVideoStream() {
//     const wsUrl = 'ws://localhost:9999';
//     const videoContainer = document.getElementById('videoContainer');

//     // Очищаем контейнер перед добавлением нового видео
//     while (videoContainer.firstChild) {
//         videoContainer.removeChild(videoContainer.firstChild);
//     }

//     // Создаем новый поток и добавляем его в контейнер
//     new JSMpeg.Player(wsUrl, {
//         canvas: videoContainer
//     });
// }


function startVideoStream() {
    const wsUrl = 'ws://localhost:9999';
    new JSMpeg.Player(wsUrl, {
        canvas: remoteVideo
    });
}