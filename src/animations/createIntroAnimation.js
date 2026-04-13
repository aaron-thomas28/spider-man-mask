import gsap from "gsap";

export function createIntroAnimation(maskMesh, textElement) {
  maskMesh.position.y = -2.1;
  maskMesh.rotation.y = -0.2;
  maskMesh.rotation.x = 0.08;

  const timeline = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  timeline.to(maskMesh.position, {
    y: 0,
    duration: 1.6,
  });

  timeline.to(
    maskMesh.rotation,
    {
      y: 0.06,
      x: 0.02,
      duration: 1.2,
    },
    0.15
  );

  timeline.to(
    maskMesh.rotation,
    {
      y: 0,
      x: 0,
      duration: 1.1,
      ease: "sine.out",
    },
    0.9
  );

  timeline.fromTo(
    textElement,
    {
      autoAlpha: 0,
      yPercent: 16,
    },
    {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.9,
      ease: "sine.out",
    },
    1.15
  );

  timeline.to(textElement, {
    autoAlpha: 0,
    yPercent: -10,
    duration: 0.75,
    ease: "sine.inOut",
  }, 2.35);

  return timeline;
}
