import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

// ---------- Scene, camera, renderer ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 30, 90); // start ver weg

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

// ---------- Texturen ----------
const loader = new THREE.TextureLoader();
const grasTex = loader.load('/textures/grass.jpg');
grasTex.wrapS = grasTex.wrapT = THREE.RepeatWrapping;
grasTex.repeat.set(30, 30);
grasTex.colorSpace = THREE.SRGBColorSpace;

const steenTex = loader.load('/textures/brick.jpg');
steenTex.wrapS = steenTex.wrapT = THREE.RepeatWrapping;
steenTex.repeat.set(3, 2);
steenTex.colorSpace = THREE.SRGBColorSpace;

// ---------- Grond ----------
const grond = new THREE.Mesh(
  new THREE.CircleGeometry(80, 64),
  new THREE.MeshStandardMaterial({ map: grasTex })
);
grond.rotation.x = -Math.PI / 2;
grond.receiveShadow = true;
scene.add(grond);

// ---------- Huis (geometrieën, kleur + textuur) ----------
const huis = new THREE.Group();


const muren = new THREE.Mesh(
  new THREE.BoxGeometry(8, 5, 6),
  new THREE.MeshStandardMaterial({ map: steenTex, color: 0xffb08a }) // kleur x textuur
);
muren.position.y = 2.5;
muren.castShadow = true;
huis.add(muren);

// Dak: piramide van een kegel met 4 zijden
const dak = new THREE.Mesh(
  new THREE.ConeGeometry(6.4, 3, 4),
  new THREE.MeshStandardMaterial({ color: 0x8b2e2e })
);
dak.position.y = 6.5;
dak.rotation.y = Math.PI / 4;
dak.castShadow = true;
huis.add(dak);

// Deur
const deur = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 2.8, 0.2),
  new THREE.MeshStandardMaterial({ color: 0x5a3a1e })
);
deur.position.set(0, 1.4, 3.05);
huis.add(deur);

// Witte kaart met mijn naam (afbeelding als textuur)
const kaart = new THREE.Mesh(
  new THREE.PlaneGeometry(2.4, 1.2),
  new THREE.MeshStandardMaterial({ map: loader.load('/textures/naamkaart.png') })
);
kaart.position.set(2.4, 3.2, 3.02);
huis.add(kaart);

// Ramen (met een kozijn)
const raamMat = new THREE.MeshStandardMaterial({ color: 0xbfe6ff, emissive: 0x335577, emissiveIntensity: 0.6 });
const kozijnMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
for (const x of [-2.4, 2.4]) {
  const kozijn = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 0.12), kozijnMat);
  const raam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.14), raamMat);
  kozijn.position.set(x, 1.6, 3.02);
  raam.position.set(x, 1.6, 3.04);
  huis.add(kozijn, raam);
}

// Schoorsteen
const schoorsteen = new THREE.Mesh(
  new THREE.BoxGeometry(0.9, 2.2, 0.9),
  new THREE.MeshStandardMaterial({ map: steenTex, color: 0xaa6644 })
);
schoorsteen.position.set(-2, 7, -1);
schoorsteen.castShadow = true;
huis.add(schoorsteen);

// Pad naar de deur
const pad = new THREE.Mesh(
  new THREE.PlaneGeometry(1.8, 14),
  new THREE.MeshStandardMaterial({ color: 0xc9b48a })
);
pad.rotation.x = -Math.PI / 2;
pad.position.set(0, 0.02, 10);
pad.receiveShadow = true;
huis.add(pad);

scene.add(huis);


// Zon
const zonBol = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfff0a0, fog: false }));
zonBol.position.set(60, 55, -70);
scene.add(zonBol);

// ---------- Bomen in een lus ----------
const stamGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.5, 8);
const stamMat = new THREE.MeshStandardMaterial({ color: 0x6b4423 });
const bladGeo = new THREE.ConeGeometry(1.4, 3.5, 8);
const bladMat = new THREE.MeshStandardMaterial({ color: 0x1f7a32 });

for (let i = 0; i < 40; i++) {
  const hoek = Math.random() * Math.PI * 2;
  const afstand = 12 + Math.random() * 55;
  const boom = new THREE.Group();
  const stam = new THREE.Mesh(stamGeo, stamMat);
  stam.position.y = 0.75;
  const blad = new THREE.Mesh(bladGeo, bladMat);
  blad.position.y = 3.2;
  stam.castShadow = blad.castShadow = true;
  boom.add(stam, blad);
  boom.position.set(Math.cos(hoek) * afstand, 0, Math.sin(hoek) * afstand);
  boom.scale.setScalar(0.7 + Math.random() * 0.8);
  scene.add(boom);
}

// ---------- Wolken in een lus ----------
const wolken = [];
const wolkMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
for (let i = 0; i < 12; i++) {
  const wolk = new THREE.Group();
  for (let j = 0; j < 4; j++) {
    const bol = new THREE.Mesh(new THREE.SphereGeometry(1.5 + Math.random(), 16, 16), wolkMat);
    bol.position.set(j * 1.8 - 3, Math.random(), Math.random());
    wolk.add(bol);
  }
  wolk.position.set((Math.random() - 0.5) * 120, 14 + Math.random() * 8, (Math.random() - 0.5) * 120);
  scene.add(wolk);
  wolken.push(wolk);
}

// ---------- 3D-model (GLB): flamingo's in een lus ----------
const flamingos = [];
new GLTFLoader().load('/models/flamingo.glb', (gltf) => {
  for (let i = 0; i < 3; i++) {
    const flamingo = gltf.scene.clone();
    flamingo.scale.setScalar(0.04);
    flamingo.position.y = 7 + i * 2;
    scene.add(flamingo);
    flamingos.push(flamingo);
  }
});

// ---------- Animaties ----------
// Camera vliegt van ver weg naar vlak voor het huis (GSAP)
gsap.to(camera.position, { x: 0, y: 5, z: 17, duration: 8, ease: 'power2.out' });

function animate(time) {
  camera.lookAt(0, 3, 0);

  // wolken drijven
  wolken.forEach((wolk) => {
    wolk.position.x += 0.02;
    if (wolk.position.x > 70) wolk.position.x = -70;
  });

  // flamingo's vliegen rondjes om het huis
  flamingos.forEach((flamingo, i) => {
    const hoek = time / 2000 + i * 2;
    flamingo.position.x = Math.cos(hoek) * (12 + i * 4);
    flamingo.position.z = Math.sin(hoek) * (12 + i * 4);
    flamingo.rotation.y = -hoek;
  });

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
