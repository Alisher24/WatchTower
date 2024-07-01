const form = document.getElementById('connectForm');
const remoteVideo = document.getElementById('remoteVideo');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const address = document.getElementById('address').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`https://localhost:7034/stream/start-stream?address=${encodeURIComponent(address)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        .then(response => response.text())
        .then(message => {
            console.log(message);
            startVideoStream();
        })
        .catch(error => {
            console.error('Ошибка подключения к камере:', error);
        });
});
function startVideoStream() {
    const wsUrl = 'wss://localhost:7034/stream';
    new JSMpeg.Player(wsUrl, {
        canvas: remoteVideo
    });
}