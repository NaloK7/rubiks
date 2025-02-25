import { Cube } from "./modules/Cube.js";
import { CubeEventHandler } from "./modules/CubeEventHandler.js";

export const myCube = new Cube();
export const cubeEvent = new CubeEventHandler();

window.addEventListener(
  "DOMContentLoaded",
  () => {
    cubeEvent.initializeEventListeners();
    myCube.generateCubeHTML();
    const mixButton = document.querySelector(".mixButton");
    mixButton.addEventListener("click", () => {
      if (myCube.start) {
        if (confirm("mélanger le cube ?")) {
          myCube.mixCube();
        }
      } else {
        myCube.mixCube();
      }
    });

    const resetCube = document.querySelector(".resetCube");
    resetCube.addEventListener("click", () => {
      if (myCube.start) {
        if (confirm("remettre le cube a zero ?")) {
          myCube.generateCubeHTML();
          myCube.resetPos();
          myCube.stopTimer();
          myCube.elapsedTime = 0;
          document.querySelector("#timer #time").innerHTML = "";
        }
      } else {
        myCube.generateCubeHTML();
        myCube.resetPos();
      }
    });

    const resetPos = document.querySelector(".realign");
    resetPos.addEventListener("click", () => myCube.resetPos());

    // MEMO

    const helpButton = document.querySelector(".helpButton");
    const helpSection = document.querySelector("#helpSection");
    helpButton.addEventListener("mouseup", () => {
      if (helpSection.style.display == "none") {
        helpSection.style.display = "flex";
      } else {
        helpSection.style.display = "none";
      }
    });
  },
  false
);
