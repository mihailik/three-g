import * as THREE from 'three';
import { createScene } from 'three-pop';
import { massSpotMesh, particleSystem } from 'three-g';

const { scene, camera, container, renderer } = createScene({
  renderer: { antialias: true },
  camera: { fov: 40, near: 0.0001 }
});

scene.add(new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff80, wireframe: true })
));

const colors = [...Array(4000)].map(() =>
  new THREE.Color().setHSL(Math.random(), 1, 0.5).getHex());

const spots = createSpots();
const m = massSpotMesh({
  spots: createSpots(40000),
  get: (_spot, coords) => {
    coords.rgb = colors[coords.index % colors.length];
  },
  fog: 200
});
scene.add(m);

container.style.cssText =
  'position: absolute; top: 0; left: 0; inset: 0;';

camera.position.y = 2;

document.body.appendChild(container);

const input = document.createElement('input');
input.style.cssText = 'position: absolute; top: 0.5em; right: 1em; background: transparent; color: #5ec15e; font-size: 200%; text-align: right; backdrop-filter: blur(2px);';
input.value = 40 * 1000;
document.body.appendChild(input);

input.oninput = () => {
  clearTimeout(input.timeout);
  input.timeout = setTimeout(() => {
    const count = parseInt(input.value);
    if (Number.isFinite(count) && count > 0) {
      m.updateSpots(createSpots(count))
    }
  }, 600);
};

/**
 * @type {ReturnType<typeof particleSystem>}
 */
var psys;

setTimeout(() => {
  runParticle();
}, 1000);

function runParticle() {
  if (!psys) {
    psys = particleSystem({
      particles: spots,
      gl: renderer.getContext()
    });
  }

  psys.compute();
}

function createSpots(count) {
  return [...Array(count)].map(() => ({
    x: Math.random() * 2 * Math.sign(Math.random() - 0.5),
    y: Math.random() * 2 * Math.sign(Math.random() - 0.5),
    z: Math.random() * Math.sign(Math.random() - 0.5),
    mass: Math.random() * 0.02,
  }));
}
