export function createMouseTracker(targetElement, mouseUniform) {
  const actualMouse = mouseUniform.clone();
  const smoothedMouse = mouseUniform.clone();

  const handlePointerMove = (event) => {
    const bounds = targetElement.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = 1 - (event.clientY - bounds.top) / bounds.height;

    actualMouse.set(x, y);
  };

  const handlePointerLeave = () => {
    actualMouse.set(-10, -10);
  };

  targetElement.addEventListener("pointermove", handlePointerMove);
  targetElement.addEventListener("pointerleave", handlePointerLeave);

  return {
    update() {
      smoothedMouse.lerp(actualMouse, 0.12);
      mouseUniform.copy(smoothedMouse);
    },
    destroy() {
      targetElement.removeEventListener("pointermove", handlePointerMove);
      targetElement.removeEventListener("pointerleave", handlePointerLeave);
    },
  };
}
