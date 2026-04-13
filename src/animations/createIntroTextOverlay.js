export function createIntroTextOverlay(container) {
  const textElement = document.createElement("p");

  textElement.className = "intro-text";
  textElement.textContent = "lets do this one last time";
  container.appendChild(textElement);

  return {
    element: textElement,
    destroy() {
      textElement.remove();
    },
  };
}
