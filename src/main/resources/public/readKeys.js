let player = window.location.href.match(/player=(\d+)/)
  ? Number(window.location.href.match(/player=(\d+)/)[1])
  : 1;

let pressedKeys = {};

const setPlayer = index => event => {
  player = index;
  ['p1', 'p2', 'p3', 'p4'].forEach(playerId => {
    document.getElementById(playerId).className = 'playerButton';
  });
  document.getElementById(`p${index}`).className = 'playerButton selected';
};
const remap = player => key =>
  [
    {},
    {
      87: 87, // up
      65: 65, // left
      83: 83, // down
      68: 68, // right
      74: 74, // 1
      75: 75, // 2
      85: 85, // A
      73: 73, // B
      81: 81, // minus
      69: 69, // plus
    },
    {
      87: 84, // up
      65: 70, // left
      83: 71, // down
      68: 72, // right
      74: 76, // 1
      75: 59, // 2
      85: 79, // A
      73: 80, // B
      81: 82, // minus
      69: 89, // plus
    },
    {
      87: 51, // up
      65: 52, // left
      83: 53, // down
      68: 54, // right
      74: 55, // 1
      75: 56, // 2
      85: 48, // A
      73: 49, // B
      81: 45, // minus
      69: 61, // plus
    },
    {
      87: 99, // up
      65: 100, // left
      83: 101, // down
      68: 102, // right
      74: 103, // 1
      75: 104, // 2
      85: 96, // A
      73: 97, // B
      81: 46, // minus
      69: 107, // plus
    },
  ][player][key] || null;
// on key down of listener, we need to make a request to the server...
document.addEventListener('keydown', event => {
  const remapKey = remap(player)(event.keyCode);
  console.log({
    event: 'DOWN',
    keyCode: event.keyCode,
    remap: remapKey,
  });
  if (pressedKeys[remapKey]) {
    return;
  }
  if (!remapKey) {
    console.log('not valid key');
    return;
  }
  pressedKeys = { ...pressedKeys, [remapKey]: true };
  const indicator = document.getElementById('indicator');
  fetch(`http://73.142.228.36:2229/keyDown/${remapKey}`).then(() => {
    indicator.style.background = 'green';
  });
});
// on key up of listener, we need to make a request to the server...
document.addEventListener('keyup', event => {
  const remapKey = remap(player)(event.keyCode);
  console.log({
    event: 'RELEASE',
    keyCode: event.keyCode,
    remap: remapKey,
  });
  if (!remapKey) {
    console.log('not valid key');
    return;
  }
  delete pressedKeys[remapKey];
  const indicator = document.getElementById('indicator');
  fetch(`http://73.142.228.36:2229/keyUp/${remapKey}`).then(() => {
    if (Object.keys(pressedKeys).length === 0) {
      indicator.style.background = 'black';
    }
  });
});
// set which player you are
document.getElementById('p1').addEventListener('click', setPlayer(1));
document.getElementById('p2').addEventListener('click', setPlayer(2));
document.getElementById('p3').addEventListener('click', setPlayer(3));
document.getElementById('p4').addEventListener('click', setPlayer(4));
