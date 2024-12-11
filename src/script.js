import { Cube } from "./src/Cube.js";
import { CubeEventHandler } from ./src/CubeEventHandler.js";

export const cubeEvent = new CubeEventHandler();
export const myCube = new Cube();

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
