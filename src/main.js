import * as THREE from 'three';

// ---------- Scene, camera, renderer ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 5, 17);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ---------- Licht ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const zon = new THREE.DirectionalLight(0xfff2cc, 2.2);
zon.position.set(15, 25, 20);
zon.castShadow = true;
zon.shadow.camera.left = -30; zon.shadow.camera.right = 30;
zon.shadow.camera.top = 30; zon.shadow.camera.bottom = -30;
scene.add(zon);

// ---------- Grond ----------
const grond = new THREE.Mesh(
  new THREE.CircleGeometry(80, 64),
  new THREE.MeshStandardMaterial({ color: 0x3f7d2a })
);
grond.rotation.x = -Math.PI / 2;
grond.receiveShadow = true;
scene.add(grond);

function animate(time) {
  camera.lookAt(0, 3, 0);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
