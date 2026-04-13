# AGENTS.md

## Project Overview

This is an interactive WebGL-based experience using Three.js and GLSL shaders.

Goal:

* Render a Spider-Man–inspired mask
* Implement shader-based reveal interaction using mouse input
* Maintain clean modular architecture

---

## Product Requirements

Refer to PRD.md for full project requirements.

Always align implementation with:
- Feature definitions
- Phases
- Architecture described in PRD.md

---

## Tech Stack

* Three.js (WebGL rendering)
* Vite (build tool)
* GLSL (shaders)
* GSAP (animations)

---

## Folder Structure

/src
/core
- scene setup
- renderer
- camera

/shaders
- vertex shaders
- fragment shaders

/effects
- reveal mask logic
- interaction systems

/animations
- intro animation
- transitions

/assets
- images (mask, person)
- textures

main.js

---

## Rules

* Do NOT create files outside the defined folder structure
* Keep rendering logic inside `/core`
* Keep shader code inside `/shaders`
* Keep interaction logic inside `/effects`
* Keep animations inside `/animations`
* Use modular, reusable functions
* Avoid monolithic files

---

## Coding Guidelines

* Use clear variable names
* Keep functions small and focused
* Separate logic and rendering
* Use shader materials for visual effects (avoid DOM hacks)

---

## Notes

* The core interaction is shader-based texture blending
* Mouse input must be passed as uniforms to shaders
* Prioritize performance and smooth rendering


## Strict Instruction

Always follow the folder structure. If unsure, ask before creating new files.