import type Lenis from "lenis";

// Shared mutable state read every frame by the WebGL background.
// Kept outside React so scroll/mouse updates never cause re-renders.
export const store = {
  progress: 0, // page scroll 0..1
  scrollY: 0, // page scroll in CSS px
  mouseX: 0, // -1..1
  mouseY: 0, // -1..1
  pointerActive: false, // a mouse has moved over the page
  sceneReady: false,
  introDone: false,
  reduced: false,
  lenis: null as Lenis | null,
};
