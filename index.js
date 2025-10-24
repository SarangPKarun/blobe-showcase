import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import getStarfield from "./libs/getStarfield.js";
import loadGlobe from "./libs/loadGlobe.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

let scrollPosY = 0;
let globe;
let stars;
let gradientBackground;

// ===================================================
// Loading Manager
// ===================================================
const loadingManager = new THREE.LoadingManager();

// Called when *all* resources (textures, models) are loaded
loadingManager.onLoad = () => {
  console.log("✅ All assets loaded!");
  const loaderScreen = document.getElementById("loading-screen");
  loaderScreen.classList.add("fade-out");
  initScene(); // only start animation after all loaded
};

// Optional — log progress
loadingManager.onProgress = (url, loaded, total) => {
  console.log(`Loading ${url} (${loaded}/${total})`);
};

// ===================================================
// Load All Assets Using the Manager
// ===================================================
const textureLoader = new THREE.TextureLoader(loadingManager);
const earthTexture = textureLoader.load("./assets/globe_texture.jpeg");
earthTexture.flipY = false;

loadGlobe("./assets/globe.glb", (loadedGlobe) => {
  globe = loadedGlobe;
  globe.material.map = earthTexture;
  globe.material.needsUpdate = true;
  scene.add(globe);
}, loadingManager); // 👈 pass manager to loadGlobe


// Load background elements (can be created instantly)
gradientBackground = getLayer({
  hue: 0.6,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -10.5,
});
scene.add(gradientBackground);

stars = getStarfield({ numStars: 4500 });
scene.add(stars);

// ===================================================
// Initialize Scene AFTER all assets loaded
// ===================================================
function initScene() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(hemiLight);

  let goalPos = 0;
  const rate = 0.1;

  function animate() {
    requestAnimationFrame(animate);

    goalPos = Math.PI * scrollPosY;

    if (globe) {
      // globe.rotation.y += globe.userData.rotationSpeed || 0.002;
      globe.rotation.y -= (globe.rotation.y - (goalPos * 2.0)) * rate;

      // const targetY = -0.5 + scrollPosY * 2.0;
      // const targetZ = 0 - scrollPosY * 1.5;
      // globe.position.y -= (globe.position.y - targetY) * rate;
      // globe.position.z -= (globe.position.z - targetZ) * rate;
    }

    stars.position.z -= (stars.position.z - goalPos * 10) * rate;
    renderer.render(scene, camera);
  }
  animate();
}

// ===================================================
// Scroll + Resize Events
// ===================================================
window.addEventListener("scroll", () => {
  scrollPosY = window.scrollY / document.body.clientHeight;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
