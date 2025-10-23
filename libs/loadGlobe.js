// libs/loadGlobe.js
import * as THREE from "three";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";

export default function loadGlobe(path, onLoad) {
  const loader = new GLTFLoader();

  loader.load(
    path,
    (gltf) => {
      let globe;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          globe = child;

          // 🧱 Clean material setup (no embedded texture)
          globe.material = new THREE.MeshStandardMaterial({
            roughness: 0.6,
            metalness: 0.1,
          });
        }
      });

      if (globe) {
        globe.position.set(0, -0.5, 0);
        globe.userData.rotationSpeed = 0.002;
        onLoad(globe);
      }
    },
    (xhr) => console.log(`Globe ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`),
    (err) => console.error("Error loading globe.glb:", err)
  );
}
