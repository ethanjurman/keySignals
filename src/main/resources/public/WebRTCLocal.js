const socket = io();
const connections = {};
let videoStreamObject;
let audioStreamObject;

const sendOffer = offer => {};

socket.on('remote request', ({ key }) => {
  console.log('remote request', key);
  const local = new RTCPeerConnection();

  const combined = new MediaStream([
    ...videoStreamObject.getTracks(),
    ...audioStreamObject.getTracks(),
  ]);

  combined.getTracks().forEach(track => local.addTrack(track, combined));

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

const startVideoButton = document.querySelector('#startVideo');

const startVideo = () => {
  return navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true })
    .then(stream => {
      const video = document.querySelector('#localVideo');

      if (audioStreamObject) {
        const combined = new MediaStream([
          ...stream.getTracks(),
          ...audioStreamObject.getTracks(),
        ]);
        video.srcObject = combined;
      } else {
        video.srcObject = stream;
      }

      return stream;
    });
};

startVideoButton.addEventListener('click', () => {
  startVideo().then(stream => {
    videoStreamObject = stream;
  });
});

const startAudio = () => {
  const audioSelect = document.querySelector('#audioDevices');
  return navigator.mediaDevices
    .getUserMedia({ audio: { deviceId: audioSelect.value } })
    .then(stream => {
      const video = document.querySelector('#localVideo');

      if (videoStreamObject) {
        const combined = new MediaStream([
          ...videoStreamObject.getTracks(),
          ...stream.getTracks(),
        ]);
        video.srcObject = combined;
      } else {
        video.srcObject = stream;
      }
      return stream;
    });
};

const startAudioButton = document.querySelector('#startAudio');

startAudioButton.addEventListener('click', () => {
  startAudio().then(stream => {
    audioStreamObject = stream;
  });
});

navigator.mediaDevices.enumerateDevices().then(devices => {
  const audioSelect = document.querySelector('#audioDevices');
  devices.forEach(device => {
    const option = document.createElement('option');
    option.text = device.label;
    option.value = device.deviceId;
    audioSelect.add(option);
  });
});
