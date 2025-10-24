// import * as THREE from "three";
// import getLayer from "./libs/getLayer.js";
// import getStarfield from "./libs/getStarfield.js";
// import loadGlobe from "./libs/loadGlobe.js";


// const w = window.innerWidth;
// const h = window.innerHeight;
// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
// camera.position.z = 5;

// const canvas = document.getElementById("three-canvas");
// const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
// renderer.setSize(w, h);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setClearColor(0x000000, 1);

// let scrollPosY = 0;
// let globe;
// let stars;
// let gradientBackground;

// // ===================================================
// // Loading Manager
// // ===================================================
// const loadingManager = new THREE.LoadingManager();

// // Called when *all* resources (textures, models) are loaded
// loadingManager.onLoad = () => {
//   console.log("✅ All assets loaded!");
//   const loaderScreen = document.getElementById("loading-screen");
//   loaderScreen.classList.add("fade-out");
//   initScene(); // only start animation after all loaded
// };

// // Optional — log progress
// loadingManager.onProgress = (url, loaded, total) => {
//   console.log(`Loading ${url} (${loaded}/${total})`);
// };

// // ===================================================
// // Load All Assets Using the Manager
// // ===================================================
// const textureLoader = new THREE.TextureLoader(loadingManager);
// const earthTexture = textureLoader.load("./assets/globe_texture.jpeg");
// earthTexture.flipY = false;

// loadGlobe("./assets/globe.glb", (loadedGlobe) => {
//   globe = loadedGlobe;
//   globe.material.map = earthTexture;
//   globe.material.needsUpdate = true;
//   scene.add(globe);
// }, loadingManager); // 👈 pass manager to loadGlobe


// // Load background elements (can be created instantly)
// gradientBackground = getLayer({
//   hue: 0.6,
//   numSprites: 8,
//   opacity: 0.2,
//   radius: 10,
//   size: 24,
//   z: -10.5,
// });
// scene.add(gradientBackground);

// stars = getStarfield({ numStars: 4500 });
// scene.add(stars);

// // ===================================================
// // Initialize Scene AFTER all assets loaded
// // ===================================================
// function initScene() {
//   const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
//   scene.add(hemiLight);

//   // const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
//   // scene.add(ambientLight);

//   const topLight = new THREE.DirectionalLight(0xffffff, 1);
//   topLight.position.set(500, 500, 500);
//   scene.add(topLight);

//   let goalPos = 0;
//   const rate = 0.1;

//   function animate() {
//     requestAnimationFrame(animate);

//     goalPos = Math.PI * scrollPosY;

//     if (globe) {
//       // globe.rotation.y += globe.userData.rotationSpeed || 0.002;
//       globe.rotation.y -= (globe.rotation.y - (goalPos * 2.5)) * rate;

//       // const targetY = -0.5 + scrollPosY * 2.0;
//       // const targetZ = 0 - scrollPosY * 1.5;
//       // globe.position.y -= (globe.position.y - targetY) * rate;
//       // globe.position.z -= (globe.position.z - targetZ) * rate;
//     }

//     stars.position.z -= (stars.position.z - goalPos * 10) * rate;
//     renderer.render(scene, camera);
//   }
//   animate();
// }

// // ===================================================
// // Scroll + Resize Events
// // ===================================================
// window.addEventListener("scroll", () => {
//   scrollPosY = window.scrollY / document.body.clientHeight;
// });

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });




// ===================================================
// ===================================================
// Only background
// ===================================================
// ===================================================

import * as THREE from "three";
import getLayer from "./libs/getLayer.js";
import getStarfield from "./libs/getStarfield.js";
import { gsap } from "gsap";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1); 

let scrollPosY = 0;
let stars, gradientBackground;

// ===================================================
// Load Background Elements
// ===================================================
function loadBackgroundElements() {
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
}

loadBackgroundElements();

// ===================================================
// Initialize Scene
// ===================================================
function initScene() {
  let goalPos = 0;
  const rate = 0.1;

  function animate() {
    requestAnimationFrame(animate);

    goalPos = Math.PI * scrollPosY;
    if (stars) stars.position.z -= (stars.position.z - goalPos * 10) * rate;

    renderer.render(scene, camera);
  }

  animate();
}

initScene();

// ===================================================
// Scroll + Resize Events
// ===================================================
window.addEventListener("scroll", () => {
  scrollPosY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});






// ===================================================
// ===================================================
// Done using Lenin
// ===================================================
// ===================================================


// import * as THREE from "three";
// import getLayer from "./libs/getLayer.js";
// import getStarfield from "./libs/getStarfield.js";
// import loadGlobe from "./libs/loadGlobe.js";

// const w = window.innerWidth;
// const h = window.innerHeight;
// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
// camera.position.z = 5;

// const canvas = document.getElementById("three-canvas");
// const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
// renderer.setSize(w, h);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setClearColor(0x000000, 1);

// let scrollPosY = 0;
// let globe;
// let stars;
// let gradientBackground;

// // ===================================================
// // Lenis Smooth Scrolling
// // ===================================================
// const lenis = new Lenis({
//   duration: 1.2,
//   easing: (t) => t, // linear easing, you can customize
//   smooth: true,
// });

// lenis.on("scroll", (e) => {
//   // e.scroll is current scroll position in px
//   scrollPosY = e.scroll / document.body.clientHeight;
// });

// // RAF loop to update Lenis
// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

// // ===================================================
// // Loading Manager
// // ===================================================
// const loadingManager = new THREE.LoadingManager();

// loadingManager.onLoad = () => {
//   console.log("✅ All assets loaded!");
//   const loaderScreen = document.getElementById("loading-screen");
//   loaderScreen.classList.add("fade-out");
//   initScene();
// };

// loadingManager.onProgress = (url, loaded, total) => {
//   console.log(`Loading ${url} (${loaded}/${total})`);
// };

// // ===================================================
// // Load Assets
// // ===================================================
// const textureLoader = new THREE.TextureLoader(loadingManager);
// const earthTexture = textureLoader.load("./assets/globe_texture.jpeg");
// earthTexture.flipY = false;

// loadGlobe("./assets/globe.glb", (loadedGlobe) => {
//   globe = loadedGlobe;
//   globe.material.map = earthTexture;
//   globe.material.needsUpdate = true;
//   scene.add(globe);
// }, loadingManager);

// gradientBackground = getLayer({
//   hue: 0.6,
//   numSprites: 8,
//   opacity: 0.2,
//   radius: 10,
//   size: 24,
//   z: -10.5,
// });
// scene.add(gradientBackground);

// stars = getStarfield({ numStars: 4500 });
// scene.add(stars);

// // ===================================================
// // Initialize Scene
// // ===================================================
// function initScene() {
//   const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
//   scene.add(hemiLight);

//   const rate = 0.1;

//   function animate() {
//     requestAnimationFrame(animate);

//     if (globe) {
//       globe.rotation.y -= (globe.rotation.y - Math.PI * scrollPosY * 2) * rate;
//     }

//     stars.position.z -= (stars.position.z - Math.PI * scrollPosY * 10) * rate;

//     renderer.render(scene, camera);
//   }

//   animate();
// }

// // ===================================================
// // Resize
// // ===================================================
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
