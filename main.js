import { Cube } from "./modules/Cube.js";
import { CubeEventHandler } from "./modules/CubeEventHandler.js";

export const myCube = new Cube();
export const cubeEvent = new CubeEventHandler();

window.addEventListener(
  "DOMContentLoaded",
  () => {
    cubeEvent.initializeEventListeners();
    myCube.generateCubeHTML();
    const mixButton = document.querySelector("#mixButton");
    mixButton.addEventListener("click", () => myCube.mixCube());
    const resetCube = document.querySelector("#resetCube");
    resetCube.addEventListener("click", () => myCube.generateCubeHTML());
    const resetPos = document.querySelector("#resetPos");
    resetPos.addEventListener("click", () => myCube.resetPos());
  },
  false
);
