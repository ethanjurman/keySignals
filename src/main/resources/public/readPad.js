const machineIP = window.location.href.match(/(.+)\//)[0]

let player = window.location.href.match(/player=(\d+)/)
  ? Number(window.location.href.match(/player=(\d+)/)[1])
  : 1;

let pressedKeys = {};

const remap = player => key =>
  [
    {},
    {
      up: 87,
      left: 65,
      down: 83,
      right: 68,
      one: 74,
      two: 75,
      A: 85,
      B: 73,
      minus: 81,
      plus: 69,
    },
    {
      up: 84,
      left: 70,
      down: 71,
      right: 72,
      one: 76,
      two: 59,
      A: 79,
      B: 80,
      minus: 82,
      plus: 89,
    },
    {
      up: 51,
      left: 52,
      down: 53,
      right: 54,
      one: 55,
      two: 56,
      A: 48,
      B: 49,
      minus: 45,
      plus: 61,
    },
    {
      up: 99,
      left: 100,
      down: 101,
      right: 102,
      one: 103,
      two: 104,
      A: 96,
      B: 97,
      minus: 46,
      plus: 107,
    },
  ][player][key] || null;

const hitKeys = keyCodes => {
  keyCodes.forEach(keyCode => {
    const remapKey = remap(player)(keyCode);
    Object.keys(pressedKeys).forEach(key => {
      if (!keyCodes.includes(key)) {
        releaseKey(key);
      }
    });
    if (pressedKeys[keyCode]) {
      return;
    }
    if (!remapKey) {
      console.log('not valid key');
      return;
    }
    console.log({
      event: 'DOWN',
      keyCode: keyCode,
      remap: remapKey,
    });
    pressedKeys = { ...pressedKeys, [keyCode]: true };
    const button = document.getElementById(keyCode);
    fetch(`${machineIP}/keyDown/${remapKey}`).then(() => {
      button.style.background = 'rgb(63, 63, 63)';
    });
  });
};

const releaseKey = keyCode => {
  const remapKey = remap(player)(keyCode);
  console.log({
    event: 'RELEASE',
    keyCode: keyCode,
    remap: remapKey,
  });
  if (!remapKey) {
    console.log('not valid key');
    return;
  }
  delete pressedKeys[keyCode];
  const button = document.getElementById(keyCode);
  fetch(`${machineIP}/keyUp/${remapKey}`).then(() => {
    if (!pressedKeys[keyCode]) {
      button.style.background = 'white';
    }
  });
};

const clearTouches = () => {
  Object.keys(pressedKeys).forEach(key => {
    releaseKey(key);
  });
};

document.getElementById('goFS').addEventListener(
  'click',
  () => {
    document.getElementById('buttonArea').requestFullscreen();
  },
  false,
);

const getTargetAtXY = ({ x, y }) => {
  return document.elementFromPoint(x, y);
};

const getAdjacentTargets = ({ target, x, y }) => {
  switch (target.id) {
    case 'up':
      return [getTargetAtXY({ x: x + 20, y }), getTargetAtXY({ x: x - 20, y })];
    case 'down':
      return [getTargetAtXY({ x: x + 20, y }), getTargetAtXY({ x: x - 20, y })];
    case 'left':
      return [getTargetAtXY({ x, y: y + 20 }), getTargetAtXY({ x, y: y - 20 })];
    case 'right':
      return [getTargetAtXY({ x, y: y + 20 }), getTargetAtXY({ x, y: y - 20 })];
    default:
      return [target];
  }
};

[...document.getElementsByClassName('padButton')].forEach(node => {
  const events = ['touchstart', 'touchmove'];
  events.forEach(eventType =>
    node.addEventListener(eventType, evt => {
      const x =
        evt.touches && evt.touches.length > 0
          ? evt.touches[0].clientX
          : evt.clientX;
      const y =
        evt.touches && evt.touches.length > 0
          ? evt.touches[0].clientY
          : evt.clientY;

      const newTarget = getTargetAtXY({ x, y });
      const adjacentTargets = getAdjacentTargets({
        target: newTarget,
        x,
        y,
      })
        .filter(target => target.id && target.id !== 'buttonArea')
        .map(target => target.id);

      const hitTargets = [...new Set(adjacentTargets)];
      if (hitTargets.length > 0) {
        hitKeys(hitTargets);
      }
    }),
  );
});

document.body.addEventListener('touchend', clearTouches);
document.body.addEventListener('touchcancel', clearTouches);
