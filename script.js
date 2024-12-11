import { generateCubeHTML } from "/cube.js";
import { initializeEventListeners } from "/event.js";
// Initialize the cube and event listeners
window.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeEventListeners();
    generateCubeHTML();
  },
  false
);
