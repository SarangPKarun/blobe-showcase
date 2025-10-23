import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import getStarfield from "./libs/getStarfield.js";
import loadGlobe from "./libs/loadGlobe.js";
// import { OBJLoader } from "jsm/loaders/OBJLoader.js";


const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);

let scrollPosY = 0;
let globe;

// ===================================================
// Initialize Scene
// ===================================================
function initScene() {
  // 🌍 Load the Globe Model
  loadGlobe("./assets/globe.glb", (loadedGlobe) => {
    globe = loadedGlobe;

    // ✅ Force custom texture
    globe.material.map = new THREE.TextureLoader().load("./assets/globe_texture.jpeg");
    globe.material.needsUpdate = true;

    // Initial position
    globe.position.set(0, -0.5, 0);
    globe.userData.rotationSpeed = 0.002;

    scene.add(globe);
  });

  // 💡 Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(hemiLight);

  // 🌈 Gradient Background
  const gradientBackground = getLayer({
    hue: 0.6,
    numSprites: 8,
    opacity: 0.2,
    radius: 10,
    size: 24,
    z: -10.5,
  });
  scene.add(gradientBackground);

  // 🌟 Starfield
  const stars = getStarfield({ numStars: 4500 });
  scene.add(stars);

  // ===================================================
  // Animation Loop
  // ===================================================
  let goalPos = 0;
  const rate = 0.1;

  function animate() {
    requestAnimationFrame(animate);

    goalPos = Math.PI * scrollPosY;

    // 🌍 Animate globe rotation + scroll movement
    if (globe) {
      globe.rotation.y -= (globe.rotation.y - (goalPos * 1.0)) * rate;
      // globe.rotation.y += globe.userData.rotationSpeed || 0.002;

      // const targetY = -0.5 + scrollPosY * 2.0;
      // const targetZ = 0 - scrollPosY * 1.5;

      // globe.position.y -= (globe.position.y - targetY) * rate;
      // globe.position.z -= (globe.position.z - targetZ) * rate;
    }

    stars.position.z -= (stars.position.z - goalPos * 8) * rate;
    renderer.render(scene, camera);
  }
  animate();
}

// ===================================================
// Start Scene
// ===================================================
initScene();

// ===================================================
// Scroll & Resize Events
// ===================================================
window.addEventListener("scroll", () => {
  scrollPosY = window.scrollY / document.body.clientHeight;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
