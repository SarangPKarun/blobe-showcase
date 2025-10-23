// libs/loadGlobe.js
import * as THREE from "three";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";

export default function loadGlobe(path, onLoad, manager = null) {
  const loader = new GLTFLoader(manager);

  loader.load(
    path,
    (gltf) => {
      let globe;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          globe = child;
          globe.material = new THREE.MeshStandardMaterial({
            roughness: 0.6,
            metalness: 0.1,
          });

          globe.castShadow = true;
          globe.recieveShadow = true;
          globe.rotation.order = "YXZ";
          globe.rotation.set(-Math.PI / 2, Math.PI, 0);


        }
      });
      if (globe) {
        globe.position.set(0, -0.5, 0);
        globe.scale.set(1.2,1.2,1.2);
        globe.userData.rotationSpeed = 0.007;
        onLoad(globe);
      }
    },
    undefined,
    (err) => console.error("Error loading globe.glb:", err)
  );
}
