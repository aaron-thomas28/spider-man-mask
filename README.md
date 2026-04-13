# Spider-Man Mask Reveal

An interactive WebGL experience built with Three.js, GLSL shaders, Vite, and GSAP.

The project renders a Spider-Man-inspired mask on a centered plane and uses a shader to reveal an underlying portrait texture around the cursor. The reveal follows the pointer with eased motion, includes a soft-edged circular blend, and adds a subtle local UV distortion for a more organic transition. On load, the mask enters from below with a cinematic intro animation and a short text overlay.

## Stack

- Three.js for scene setup, camera, renderer, textures, geometry, and shader materials
- GLSL for the reveal effect
- GSAP for the intro animation timeline
- Vite for development and production builds

## Current Features

- Centered WebGL scene with a single textured plane
- Shader-based blending between `mask.png` and `person.png`
- Circular reveal controlled by mouse position in UV space
- Soft reveal edges using `smoothstep`
- Subtle UV distortion near the reveal area
- Smoothed cursor motion using lerp before updating the shader uniform
- Idle breathing animation using slight scale and rotation over time
- Intro animation where the mask rises into frame from below
- Intro text overlay that fades in and out over the canvas

## How It Works

### Scene setup

The app bootstraps in `src/main.js`, imports the global stylesheet, and mounts the WebGL experience into `#app`.

`src/core/createApp.js` is the main runtime entry:

- creates the camera and renderer
- creates the scene asynchronously after textures are loaded
- mounts the renderer canvas into the container
- creates the intro text overlay
- starts the GSAP intro animation
- runs the render loop
- handles resize updates and cleanup

### Scene contents

`src/core/createScene.js` builds the actual Three.js scene:

- creates a dark background scene
- loads `src/assets/mask.png` and `src/assets/person.png`
- derives plane dimensions from the mask texture aspect ratio
- creates a single centered plane mesh
- applies a `ShaderMaterial` that receives both textures
- attaches mouse tracking logic
- exposes:
  - `scene`
  - `maskMesh` for intro animation
  - `update(elapsedTime)` for per-frame interaction and idle motion
  - `destroy()` for cleanup

The geometry is a simple `PlaneGeometry` centered at the origin.

### Shader reveal system

`src/effects/createRevealMaterial.js` creates the `ShaderMaterial` and wires these uniforms:

- `uMaskTexture`
- `uPersonTexture`
- `uMouse`

The shader files live in `src/shaders`:

- `vertex.glsl` passes UVs through to the fragment shader
- `fragment.glsl` performs the reveal and distortion

The fragment shader logic is:

1. Measure distance from the current fragment UV to `uMouse`
2. Define a reveal radius and blur zone
3. Use `smoothstep` to create a soft circular mask
4. Compute a small UV distortion whose strength falls off with distance from the cursor
5. Sample both textures with the distorted UV
6. Blend mask and portrait with `mix()`

This keeps the reveal soft and local instead of producing a hard cutout.

### Mouse tracking and easing

`src/effects/createMouseTracker.js` keeps two mouse positions:

- `actualMouse`: updated directly from pointer movement
- `smoothedMouse`: lerped toward `actualMouse` every frame

That smoothed value is copied into the shader uniform during the render loop. This prevents the reveal area from snapping abruptly to cursor updates.

When the pointer leaves the canvas, the actual mouse is moved off-screen in UV space so the reveal disappears naturally.

### Render loop and idle animation

The renderer loop runs in `createApp()` using `renderer.setAnimationLoop(...)`.

Each frame:

1. elapsed time is converted from milliseconds to seconds
2. `sceneSetup.update(elapsedTime)` is called
3. the scene is rendered

Inside `createScene().update(...)`:

- mouse smoothing is updated
- the plane gets a very small `rotation.z` oscillation
- the plane gets a gentle scale pulse

This creates the breathing effect without changing shader logic.

### Intro animation

The intro animation lives in `src/animations/createIntroAnimation.js`.

On startup:

- the mask mesh starts below frame with a slight initial rotation
- GSAP animates the mesh upward to center using an ease-out curve
- rotation settles during and after the move
- the text overlay fades in after the mask arrives
- the text fades out before normal interaction becomes the focus

### Intro text overlay

The text overlay is created in `src/animations/createIntroTextOverlay.js`.

- it creates a `<p>` element with the text `lets do this one last time`
- the element is appended to the app container
- it is positioned over the canvas with CSS
- GSAP controls its opacity and movement during the intro

Styling is defined in `src/style.css` and keeps the presentation minimal, dark, and cinematic.

## Project Structure

```text
src/
  animations/
    createIntroAnimation.js
    createIntroTextOverlay.js
  assets/
    mask.png
    person.png
  core/
    createApp.js
    createCamera.js
    createRenderer.js
    createScene.js
  effects/
    createMouseTracker.js
    createRevealMaterial.js
  shaders/
    vertex.glsl
    fragment.glsl
  main.js
  style.css
```

## Important Files

- `src/main.js`: app entry point
- `src/core/createApp.js`: runtime wiring, render loop, resize handling, cleanup
- `src/core/createScene.js`: scene creation, texture loading, mesh creation, per-frame updates
- `src/effects/createRevealMaterial.js`: shader material and uniforms
- `src/effects/createMouseTracker.js`: pointer tracking and cursor smoothing
- `src/shaders/fragment.glsl`: reveal mask, edge softness, and subtle distortion
- `src/animations/createIntroAnimation.js`: mask intro motion and text timing
- `src/animations/createIntroTextOverlay.js`: DOM overlay creation
- `src/style.css`: app shell and overlay styling

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts the Vite dev server.

## Production Build

```bash
npm run build
```

To preview the production output locally:

```bash
npm run preview
```

## Assets

The current implementation uses:

- `src/assets/mask.png`
- `src/assets/person.png`

Both are loaded through Three.js `TextureLoader` and assigned to shader uniforms.

## Performance Notes

- texture color space is set to `THREE.SRGBColorSpace`
- texture filtering is set to `LinearFilter`
- renderer pixel ratio is capped with `Math.min(window.devicePixelRatio, 2)`
- the effect uses a single plane and a single shader material, which keeps geometry simple

## Current Limitations

- the experience currently uses one plane rather than a more advanced layered scene
- reveal behavior is circular only
- there is no skyline or parallax background yet
- there is no intro text sequencing beyond the current overlay
- Vite currently reports a chunk-size warning on build; this does not block execution, but code splitting could be added later

## Alignment With PRD

The current implementation covers the core of these PRD phases:

- Phase 1: project setup and render loop
- Phase 2: centered mask rendering
- Phase 3: shader-based reveal system
- Phase 4: cursor interaction and smoothed reveal movement
- Phase 5: intro animation and temporary intro text
- Phase 6: early polish with subtle distortion and idle motion

## Next Logical Improvements

- move reveal radius and blur into uniforms for easier tuning
- add a dedicated interaction state so the intro formally gates reveal input
- add subtle parallax based on cursor movement
- add background treatment from the PRD future phases
- split large production bundles if bundle size becomes a concern
