uniform sampler2D uMaskTexture;
uniform sampler2D uPersonTexture;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  float distanceToMouse = distance(vUv, uMouse);
  float revealRadius = 0.22;
  float edgeBlur = revealRadius * 0.65;
  float innerRadius = max(revealRadius - edgeBlur, 0.0);
  float outerRadius = revealRadius + edgeBlur;
  float reveal = 1.0 - smoothstep(innerRadius, outerRadius, distanceToMouse);
  float distortionStrength = 0.012 * (1.0 - smoothstep(0.0, outerRadius, distanceToMouse));
  vec2 distortionDirection = normalize(vUv - uMouse + vec2(0.0001));
  vec2 distortedUv = vUv + distortionDirection * distortionStrength;
  vec4 maskColor = texture2D(uMaskTexture, distortedUv);
  vec4 personColor = texture2D(uPersonTexture, distortedUv);

  vec4 finalColor = mix(maskColor, personColor, reveal);

  gl_FragColor = vec4(finalColor.rgb, finalColor.a);
}
