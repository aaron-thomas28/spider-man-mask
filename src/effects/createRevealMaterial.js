import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/fragment.glsl?raw";

export function createRevealMaterial(maskTexture, personTexture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMaskTexture: { value: maskTexture },
      uPersonTexture: { value: personTexture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });
}
