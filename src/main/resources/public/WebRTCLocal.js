const socket = io();
const connections = {};
let videoStreamObject = new MediaStream();
let audioStreamObject = new MediaStream();

const stunURLS = [
  `stun:stun.services.mozilla.org:3478`,
  `stun:stun.wtfismyip.com:3478`,
  `stun:stun.counterpath.net:3478`,
  `stun:stun.cryptonit.net:3478`,
  `stun:stun.darioflaccovio.it:3478`,
  `stun:stun.datamanagement.it:3478`,
  `stun:stun.dcalling.de:3478`,
  `stun:stun.decanet.fr:3478`,
  `stun:stun.develz.org:3478`,
  `stun:stun.dingaling.ca:3478`,
  `stun:stun.doublerobotics.com:3478`,
  `stun:stun.drogon.net:3478`,
  `stun:stun.halonet.pl:3478`,
  `stun:stun.hellonanu.com:3478`,
  `stun:stun.liveo.fr:3478`,
  `stun:stun.lowratevoip.com:3478`,
  `stun:stun.lugosoft.com:3478`,
  `stun:stun.lundimatin.fr:3478`,
  `stun:stun.magnet.ie:3478`,
  `stun:stun.manle.com:3478`,
  `stun:stun.mgn.ru:3478`,
  `stun:stun.mit.de:3478`,
  `stun:stun.mitake.com.tw:3478`,
  `stun:stun.ooma.com:3478`,
  `stun:stun.ooonet.ru:3478`,
  `stun:stun.oriontelekom.rs:3478`,
  `stun:stun.outland-net.de:3478`,
  `stun:stun.ozekiphone.com:3478`,
  `stun:stun.patlive.com:3478`,
  `stun:stun.personal-voip.de:3478`,
  `stun:stun.petcube.com:3478`,
  `stun:stun.phone.com:3478`,
  `stun:stun.rolmail.net:3478`,
  `stun:stun.rounds.com:3478`,
  `stun:stun.rynga.com:3478`,
  `stun:stun.samsungsmartcam.com:3478`,
  `stun:stun.schlund.de:3478`,
  `stun:stun.services.mozilla.com:3478`,
  `stun:stun.sigmavoip.com:3478`,
  `stun:stun.sip.us:3478`,
  `stun:stun.sipdiscount.com:3478`,
  `stun:stun.sonetel.com:3478`,
  `stun:stun.sonetel.net:3478`,
  `stun:stun.sovtest.ru:3478`,
  `stun:stun.speedy.com.ar:3478`,
  `stun:stun.spokn.com:3478`,
  `stun:stun.srce.hr:3478`,
  `stun:stun.ssl7.net:3478`,
  `stun:stun.stunprotocol.org:3478`,
  `stun:stun.symform.com:3478`,
  `stun:stun.symplicity.com:3478`,
  `stun:stun.unseen.is:3478`,
  `stun:stun.usfamily.net:3478`,
  `stun:stun.veoh.com:3478`,
  `stun:stun.vidyo.com:3478`,
  `stun:stun.vipgroup.net:3478`,
  `stun:stun.virtual-call.com:3478`,
  `stun:stun.viva.gr:3478`,
  `stun:stun.vivox.com:3478`,
  `stun:stun.vline.com:3478`,
  `stun:stun.vo.lu:3478`,
  `stun:stun.zoiper.com:3478`,
  `stun:stun1.faktortel.com.au:3478`,
  `stun:stun1.voiceeclipse.net:3478`,
];

socket.on('remote request', ({ key }) => {
  console.log('remote request', key);
  const local = new RTCPeerConnection({
    iceServers: [
      {
        urls: stunURLS,
      },
    ],
  });

  const combined = new MediaStream([
    ...videoStreamObject.getTracks(),
    ...audioStreamObject.getTracks(),
  ]);

  combined.getTracks().forEach(track => local.addTrack(track, combined));

  local.addEventListener('icecandidate', evt => {
    if (evt.candidate) {
      console.log('remote ice candidate', key);
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

socket.on('close', ({ key }) => {
  const local = connections[key];
  if (local) {
    console.log('remove connection', key);
    local.close();
  }
});

const startVideoButton = document.querySelector('#startVideo');

const startVideo = () => {
  return navigator.mediaDevices
    .getDisplayMedia({
      video: true,
      audio: true,
    })
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
      video.className = '';

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
      video.className = '';

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

const videoElement = document.querySelector('video');

videoElement.onpause = event => event.target.play();
