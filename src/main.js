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
