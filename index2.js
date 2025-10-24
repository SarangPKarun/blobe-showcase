import * as THREE from "three";
import { gsap } from "gsap";
import getLayer from "./libs/getLayer.js";
import getStarfield from "./libs/getStarfield.js";
import loadGlobe from "./libs/loadGlobe.js";

// =======================================
// Basic Setup
// =======================================
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

// =======================================
// Loading Manager
// =======================================
const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  console.log("✅ All assets loaded!");
  const loaderScreen = document.getElementById("loading-screen");
  loaderScreen?.classList.add("fade-out");
  initScene();
};

loadingManager.onProgress = (url, loaded, total) => {
  console.log(`Loading ${url} (${loaded}/${total})`);
};

// =======================================
// Load Assets
// =======================================
const textureLoader = new THREE.TextureLoader(loadingManager);
const earthTexture = textureLoader.load("./assets/globe_texture.jpeg");
earthTexture.flipY = false;

loadGlobe("./assets/globe.glb", (loadedGlobe) => {
  globe = loadedGlobe;
  globe.material.map = earthTexture;
  globe.material.needsUpdate = true;
  scene.add(globe);
}, loadingManager);

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

// =======================================
// Initialize Scene
// =======================================
function initScene() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(hemiLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  scene.add(topLight);

  const rate = 0.1;

  const positions = [
    {
      id: "home",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 1.5, z: 0 },
    },
    {
      id: "about",
      position: { x: 5, y: 0, z: 0 },
      rotation: { x: 0.5, y: -0.5, z: 0 },
    },
    {
      id: "contact",
      position: { x: -5, y: 0, z: 0 },
      rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
      id: "download",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0.3, y: -0.5, z: 0 },
    },
  ];

  // === Function to move globe based on current section ===
  function modelMove() {
    const sections = [];

    sections.push(document.getElementById("home"));
    sections.push(document.getElementById("about"));
    sections.push(document.getElementById("contact"));
    sections.push(document.getElementById("download"));
    let currentSection;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 3) {
        currentSection = section.id;
      }
    });

    const active = positions.find((p) => p.id === currentSection);
    if (active && globe) {
      gsap.to(globe.position, {
        x: active.position.x,
        y: active.position.y,
        z: active.position.z,
        duration: 2,
        ease: "power1.out",
      });
      gsap.to(globe.rotation, {
        x: active.rotation.x,
        y: active.rotation.y,
        z: active.rotation.z,
        duration: 2,
        ease: "power1.out",
      });
    }
  }

  // === Animate ===
  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  // === Scroll event ===
  window.addEventListener("scroll", () => {
    scrollPosY = window.scrollY / document.body.clientHeight;
    modelMove();
  });
}

// =======================================
// Resize Handler
// =======================================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
