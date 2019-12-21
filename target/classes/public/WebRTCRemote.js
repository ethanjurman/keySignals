const stunURLS = [
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

const remote = new RTCPeerConnection({
  iceServers: [
    {
      urls: stunURLS,
    },
  ],
});

const socket = io();
// pretty good, as long as people don't jump in on the same ms
const uniqueHash = new Date().getTime().toString(36);

const gotRemoteStream = event => {
  const video = document.querySelector('#remoteVideo');
  video.className = '';
  video.srcObject = event.streams[0];
};

socket.on('host connected', ({ key, offer }) => {
  if (key !== uniqueHash) {
    return null;
  }
  setEvents(remote);
  remote
    .setRemoteDescription(offer)
    .then(() => {
      console.log('create answer');
      return remote.createAnswer();
    })
    .then(answer => {
      console.log('set remote description');
      return remote.setLocalDescription(new RTCSessionDescription(answer));
    })
    .then(() => {
      console.log('send remote offer', uniqueHash);
      socket.emit('remote offer', {
        key: uniqueHash,
        offer: remote.localDescription,
      });
    });
});

socket.on('remote candidate', ({ key, candidate }) => {
  if (key === uniqueHash) {
    console.log('remote candidate');
    remote.addIceCandidate(candidate);
  }
});

const setEvents = remote => {
  remote.addEventListener('track', gotRemoteStream);

  remote.addEventListener('icecandidate', evt => {
    if (evt.candidate) {
      console.log('host ice candidate', uniqueHash);
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

const videoElement = document.querySelector('video');

videoElement.onpause = event => event.target.play();
