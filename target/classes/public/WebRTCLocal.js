const socket = io();
const connections = {};
let streamObject;

const sendOffer = offer => {};

socket.on('remote request', ({ key }) => {
  console.log('remote request', key);
  const local = new RTCPeerConnection();

  streamObject
    .getTracks()
    .forEach(track => local.addTrack(track, streamObject));

  local.addEventListener('icecandidate', evt => {
    if (evt.candidate) {
      socket.emit('remote ice candidate', { key, candidate: evt.candidate });
    }
  });

  local
    .createOffer()
    .then(offer => local.setLocalDescription(new RTCSessionDescription(offer)))
    .then(() =>
      socket.emit('host offer', { key, offer: local.localDescription }),
    );

  connections[key] = local;
});

socket.on('remote connected', ({ key, offer }) => {
  const local = connections[key];
  console.log('remote connected', key);
  local.setRemoteDescription(offer);
});

socket.on('host candidate', ({ key, candidate }) => {
  const local = connections[key];
  local.addIceCandidate(candidate);
});

const startVideo = () => {
  let captureStream = null;

  return navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true })
    .then(stream => {
      const video = document.querySelector('#localVideo');
      video.srcObject = stream;
      return stream;
    });
};

const startVideoButton = document.querySelector('#startVideo');

startVideoButton.addEventListener('click', () => {
  startVideo().then(stream => {
    streamObject = stream;
  });
});
