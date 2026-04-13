import { createCamera } from "./createCamera";
import { createRenderer } from "./createRenderer";
import { createScene } from "./createScene";
import { createIntroAnimation } from "../animations/createIntroAnimation";
import { createIntroTextOverlay } from "../animations/createIntroTextOverlay";

export async function createApp(container = document.body) {
  const camera = createCamera();
  const renderer = createRenderer();
  const introTextOverlay = createIntroTextOverlay(container);

  container.appendChild(renderer.domElement);
  const sceneSetup = await createScene(renderer.domElement);
  const { scene } = sceneSetup;
  const introAnimation = createIntroAnimation(
    sceneSetup.maskMesh,
    introTextOverlay.element
  );

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  renderer.setAnimationLoop((time) => {
    sceneSetup.update(time * 0.001);
    renderer.render(scene, camera);
  });

  return {
    scene,
    camera,
    renderer,
    destroy() {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null);
      introAnimation.kill();
      introTextOverlay.destroy();
      sceneSetup.destroy();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
