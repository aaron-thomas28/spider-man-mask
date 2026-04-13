import * as THREE from "three";
import maskTextureUrl from "../assets/mask.png";
import personTextureUrl from "../assets/person.png";
import { createMouseTracker } from "../effects/createMouseTracker";
import { createRevealMaterial } from "../effects/createRevealMaterial";

function createTexture(loader, url) {
  return loader.loadAsync(url).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  });
}

function createCenteredPlane(geometry, material, zPosition) {
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 0, zPosition);

  return mesh;
}

function createPlaneGeometry(texture) {
  const aspectRatio = texture.image.width / texture.image.height;
  const planeHeight = 2.4;
  const planeWidth = planeHeight * aspectRatio;

  return new THREE.PlaneGeometry(planeWidth, planeHeight);
}

export async function createScene(targetElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x06070a);
  const textureLoader = new THREE.TextureLoader();
  const [personTexture, maskTexture] = await Promise.all([
    createTexture(textureLoader, personTextureUrl),
    createTexture(textureLoader, maskTextureUrl),
  ]);
  const planeGeometry = createPlaneGeometry(maskTexture);
  const revealMaterial = createRevealMaterial(maskTexture, personTexture);
  const revealPlane = createCenteredPlane(planeGeometry, revealMaterial, 0);
  const mouseTracker = createMouseTracker(
    targetElement,
    revealMaterial.uniforms.uMouse.value
  );

  scene.add(revealPlane);

  return {
    scene,
    maskMesh: revealPlane,
    update(elapsedTime = 0) {
      mouseTracker.update();
      revealPlane.rotation.z = Math.sin(elapsedTime * 0.6) * 0.015;

      const breathingScale = 1 + Math.sin(elapsedTime * 1.2) * 0.012;
      revealPlane.scale.set(breathingScale, breathingScale, 1);
    },
    destroy() {
      mouseTracker.destroy();
      planeGeometry.dispose();
      revealMaterial.dispose();
      personTexture.dispose();
      maskTexture.dispose();
    },
  };
}
