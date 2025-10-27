// bannerManager.js
import * as THREE from "three";
import { gsap } from "gsap";

function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

export function createBanner(globe, numBanners = 6) {
  const banners = [];
  const textureLoader = new THREE.TextureLoader();

  const frontTexture = textureLoader.load("./assets/banner/bannerfront.jpg");
  const backTexture = textureLoader.load("./assets/banner/bannerback.jpg");
  const sideColor = 0xdddddd;

  frontTexture.flipY = false;

  const globeRadius = 1.0;
  const altitude = 0.2;
  const minDistance = 0.8; // minimum distance between banners

  for (let i = 0; i < numBanners; i++) {
    let valid = false;
    let lat, lon, x, y, z, newPos;

    // Retry loop until we find a valid position
    while (!valid) {
      lat = THREE.MathUtils.degToRad(-60 + Math.random() * 120);
      lon = THREE.MathUtils.degToRad(-180 + Math.random() * 360);

      x = (globeRadius + altitude) * Math.cos(lat) * Math.cos(lon);
      y = (globeRadius + altitude) * Math.sin(lat);
      z = (globeRadius + altitude) * Math.cos(lat) * Math.sin(lon);

      newPos = new THREE.Vector3(x, y, z);
      valid = true;

      // Check distance to existing banners
      for (let b of banners) {
        if (newPos.distanceTo(b.userData.originalPos) < minDistance) {
          valid = false;
          break;
        }
      }
    }

    const geometry = new THREE.BoxGeometry(0.2, 0.005, 0.3); // width, height, depth
    const materials = [
      new THREE.MeshStandardMaterial({ color: sideColor }),
      new THREE.MeshStandardMaterial({ color: sideColor }),
      new THREE.MeshStandardMaterial({ map: frontTexture }),
      new THREE.MeshStandardMaterial({ map: backTexture }),
      new THREE.MeshStandardMaterial({ color: sideColor }),
      new THREE.MeshStandardMaterial({ color: sideColor }),
    ];

    const banner = new THREE.Mesh(geometry, materials);

    // Store original position for fixed altitude
    banner.userData.originalPos = newPos.clone();
    banner.position.copy(newPos);

    // Make it face outward
    const target = new THREE.Vector3().copy(newPos).multiplyScalar(2);
    banner.lookAt(target);

    globe.add(banner);
    banners.push(banner);
  }

  return banners;
}


// ===================================================
// Hover Zoom Logic
// ===================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredBanner = null;

export function enableBannerHoverZoom(renderer, camera, banners) {
  window.addEventListener("mousemove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  function handleHover() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(banners);

    if (intersects.length > 0) {
      const target = intersects[0].object;

      if (hoveredBanner !== target) {
        if (hoveredBanner) gsap.to(hoveredBanner.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        hoveredBanner = target;
        gsap.to(target.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.3 });
      }
    } else if (hoveredBanner) {
      gsap.to(hoveredBanner.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      hoveredBanner = null;
    }
  }

  return { handleHover };
}
