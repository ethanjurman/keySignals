const remote = new RTCPeerConnection();
const host = new RTCPeerConnection();

const socket = io();
// pretty good, as long as people don't jump in on the same ms
const uniqueHash = new Date().getTime().toString(36);

const gotRemoteStream = event => {
  const video = document.querySelector('#remoteVideo');
  video.srcObject = event.streams[0];
};

socket.on('host connected', ({ key, offer }) => {
  if (key !== uniqueHash) {
    return null;
  }
  setEvents(remote);
  remote
    .setRemoteDescription(offer)
    .then(() => remote.createAnswer())
    .then(answer =>
      remote.setLocalDescription(new RTCSessionDescription(answer)),
    )
    .then(() =>
      socket.emit('remote offer', {
        key: uniqueHash,
        offer: remote.localDescription,
      }),
    );
});

socket.on('remote candidate', ({ key, candidate }) => {
  if (key === uniqueHash) {
    remote.addIceCandidate(candidate);
  }
});

const setEvents = remote => {
  remote.addEventListener('track', gotRemoteStream);

  remote.addEventListener('icecandidate', evt => {
    if (evt.candidate) {
      socket.emit('host ice candidate', {
        key: uniqueHash,
        candidate: evt.candidate,
      });
    }
  });
};

const connectButton = document.querySelector('#connect');
connectButton.addEventListener('click', () => {
  socket.emit('request host', uniqueHash);
});
