import { VectorUtils } from "./VectorUtils.js";

export class Cube extends VectorUtils {
  constructor() {
    super(VectorUtils);
    this.rotateX = 336;
    this.rotateY = 315;
    this.rotateZ = 0;
    this.animationSpeed = 300;
    this.mixSpeed = this.animationSpeed / 5;
    this.isAnimate = false;
    this.start = false;
    this.isSolved = false;

    this.timer = null;
    this.startTime = null;
    this.elapsedTime = 0;
    this.isTiming = false;

    this.refCube = [
      [
        ["Ftl L U F", "Ftc M U F", "Ftr R U F"],
        ["Fml L E F", "Fmc M E F", "Fmr R E F"],
        ["Fbl L D F", "Fbc M D F", "Fbr R D F"],
      ],
      [
        ["Ltl B U L", "Ltc S U L", "Ltr F U L"],
        ["Lml B E L", "Lmc S E L", "Lmr F E L"],
        ["Lbl B D L", "Lbc S D L", "Lbr F D L"],
      ],
      [
        ["Btl R U B", "Btc M U B", "Btr L U B"],
        ["Bml R E B", "Bmc M E B", "Bmr L E B"],
        ["Bbl R D B", "Bbc M D B", "Bbr L D B"],
      ],
      [
        ["Rtl F U R", "Rtc S U R", "Rtr B U R"],
        ["Rml F E R", "Rmc S E R", "Rmr B E R"],
        ["Rbl F D R", "Rbc S D R", "Rbr B D R"],
      ],
      [
        ["Utl L B U", "Utc M B U", "Utr R B U"],
        ["Uml L S U", "Umc M S U", "Umr R S U"],
        ["Ubl L F U", "Ubc M F U", "Ubr R F U"],
      ],
      [
        ["Dtl L F D", "Dtc M F D", "Dtr R F D"],
        ["Dml L S D", "Dmc M S D", "Dmr R S D"],
        ["Dbl L B D", "Dbc M B D", "Dbr R B D"],
      ],
    ];

    this.cube = JSON.parse(JSON.stringify(this.refCube));
    this.frontFace = this.cube[0];
    this.leftFace = this.cube[1];
    this.backFace = this.cube[2];
    this.rightFace = this.cube[3];
    this.upFace = this.cube[4];
    this.downFace = this.cube[5];

    this.faceHorizontalVector = null;
    this.faceVerticalVector = null;

    this.applyCubeRotation();
  }

  // FACE VECTORS
  getFaceIndex(faceLetter) {
    const faceMap = {
      F: 0, // Front face
      L: 1, // Left face
      B: 2, // Back face
      R: 3, // Right face
      U: 4, // Up face
      D: 5, // Down face
    };
    return faceMap[faceLetter] ?? -1;
  }

  /**
   * Retrieves the center point coordinates of a specified square on the cube.
   *
   * @param {number} faceIndex - The index of the face on the cube.
   * @param {number} row - The row index of the square on the face.
   * @param {number} col - The column index of the square on the face.
   * @returns {Object} An object containing the x and y coordinates of the square's center.
   */
  getPoint(faceIndex, row, col) {
    const select = this.cube[faceIndex][row][col].split(" ")[0]; // ex: Ftl
    const square = document.querySelector(`.${select}`);
    const squareRect = square.getBoundingClientRect();
    let x = squareRect.left + squareRect.width / 2;
    let y = squareRect.top + squareRect.height / 2;
    return { x, y };
  }

  /**
   * Sets the horizontal and vertical vectors for a given face of the cube.
   *
   * @param {HTMLElement} square - The HTML element representing a square on the cube.
   * Determines the face of the cube based on the square's class and calculates
   * the horizontal and vertical vectors using the center points of specific squares.
   */
  setFaceVectors(square) {
    const faceLetter = square.classList[1][0];
    const faceIndex = this.getFaceIndex(faceLetter);

    if (faceIndex !== -1) {
      this.faceHorizontalVector = this.createVector(
        this.getPoint(faceIndex, 1, 0).x,
        this.getPoint(faceIndex, 1, 0).y,
        this.getPoint(faceIndex, 1, 2).x,
        this.getPoint(faceIndex, 1, 2).y
      );
      this.faceVerticalVector = this.createVector(
        this.getPoint(faceIndex, 0, 1).x,
        this.getPoint(faceIndex, 0, 1).y,
        this.getPoint(faceIndex, 2, 1).x,
        this.getPoint(faceIndex, 2, 1).y
      );
    }
  }

  resetFaceVectors() {
    this.faceHorizontalVector = null;
    this.faceVerticalVector = null;
  }

  // CUBE ROTATION

  updateRotateX(value) {
    this.rotateX = (this.rotateX + value + 360) % 360;
  }

  updateRotateY(value) {
    this.rotateY = (this.rotateY - value + 360) % 360;
  }

  updateRotateZ(value) {
    this.rotateZ = (this.rotateZ - value + 360) % 360;
  }

  resetPos() {
    this.rotateX = 336;
    this.rotateY = 315;
    this.rotateZ = 0;
    this.applyCubeRotation();
  }

  applyCubeRotation() {
    const cubeElement = document.querySelector(".cube");
    cubeElement.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg)`;
  }

  // GROUP ROTATION

  /**
   * Rotates a specified group of squares on the cube based on the move type.
   *
   * @param {string} move - The move type indicating which group to rotate (e.g., "L", "M", "R", "U", "E", "D", "F", "S", "B").
   * @param {boolean} [reverse=false] - Whether to rotate the group in reverse direction.
   * @param {number} [speed=this.animationSpeed] - The speed of the rotation animation in milliseconds.
   *
   * Initiates the rotation animation for the specified group, updates the cube's state,
   * and resets the animation state after completion.
   */
  rotateGroup(move, reverse = false, speed = this.animationSpeed) {
    this.start = true;
    if (!this.isTiming) {
      this.startTimer();
    }
    if (!this.isAnimate) {
      this.isAnimate = true;
      let deg = reverse ? "" : "-";
      deg +=
        move === "L" || move === "M" || move === "R"
          ? "x"
          : move === "U" || move === "E" || move === "D"
          ? "y"
          : "z";
      const blackPlate = document.querySelectorAll(`.blackPlate.${move}`);
      blackPlate.forEach((square) => {
        square.style.backgroundColor = "black";
      });
      const group = document.querySelectorAll(`.${move}`);
      const moveGroup = document.querySelector(".moveGroup");

      // add every part that need move except 2 "blackPlate"
      group.forEach((square) => {
        if (square.classList.contains("fix")) {
        } else {
          moveGroup.appendChild(square);
        }
      });
      moveGroup.style.transition = `rotate ease ${speed * 0.001}s`;
      moveGroup.classList.add(deg);

      switch (move) {
        case "L":
          this.moveL(reverse);
          break;
        case "M":
          this.moveM(reverse);
          break;
        case "R":
          this.moveR(reverse);
          break;
        case "U":
          this.moveU(reverse);
          break;
        case "E":
          this.moveE(reverse);
          break;
        case "D":
          this.moveD(reverse);
          break;
        case "F":
          this.moveF(reverse);
          break;
        case "S":
          this.moveS(reverse);
          break;
        case "B":
          this.moveB(reverse);
          break;
        default:
          console.log("function not ready");
          break;
      }
      // Wait for the animation to end before proceeding to the next step
      setTimeout(() => {
        this.setNewPos();
        blackPlate.forEach((square) => {
          square.style.backgroundColor = "transparent";
        });
        const cube = document.querySelector(".cube");
        group.forEach((square) => {
          cube.appendChild(square);
        });
        moveGroup.classList.remove(deg);
        this.isAnimate = false;

        this.isCubeSolved();
      }, speed);
    }
  }

  // GENERATE / RESET / REPOSITION / IS SOLVED

  /**
   * Resets the cube's position to its initial state by updating the class
   * names of each square element to match the reference cube configuration.
   * Clears any temporary transitions and restores the cube's faces to their
   * original configuration.
   */
  setNewPos() {
    this.cube.forEach((face, faceIndex) => {
      face.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const refSquare =
            this.refCube[faceIndex][rowIndex][columnIndex].split(" ");
          const movedSquare =
            this.cube[faceIndex][rowIndex][columnIndex].split(" ");
          const squareList = document.querySelectorAll(`.${movedSquare[0]}`);

          squareList.forEach((square) => {
            if (square.classList[0] !== "temp") {
              square.style.transition = "";
              square.classList = `temp square `;
              refSquare.forEach((cls) => square.classList.add(cls));
            }
          });
        });
      });
    });

    document.querySelectorAll(".square").forEach((element) => {
      element.classList.remove("temp");
    });

    this.cube = JSON.parse(JSON.stringify(this.refCube));
    this.frontFace = this.cube[0];
    this.leftFace = this.cube[1];
    this.backFace = this.cube[2];
    this.rightFace = this.cube[3];
    this.upFace = this.cube[4];
    this.downFace = this.cube[5];
  }

  mixCube() {
    const possibleMove = ["L", "M", "R", "U", "E", "D", "F", "S", "B"];
    const sequence = [];
    const moveNumber = 35;

    while (sequence.length < moveNumber) {
      const randomElement =
        possibleMove[Math.floor(Math.random() * possibleMove.length)];
      if (
        sequence.length === 0 ||
        randomElement !== sequence[sequence.length - 1]
      ) {
        sequence.push(randomElement);
      }
    }
    let index = 0;

    const performMove = () => {
      let speed = this.mixSpeed;
      if (index < sequence.length) {
        this.rotateGroup(sequence[index], false, speed);
        index++;
        setTimeout(performMove, speed + 50);
      }
    };

    performMove();
  }

  generateCubeHTML() {
    const faceColors = {
      front: "blue",
      up: "white",
      left: "red",
      right: "orange",
      back: "green",
      bottom: "yellow",
    };
    const faceNames = ["front", "left", "back", "right", "up", "bottom"];
    const cubeContainer = document.querySelector(".cube");

    faceNames.forEach((face, faceIndex) => {
      this.cube[faceIndex].forEach((row, rowIndex) => {
        row.forEach((element, columnIndex) => {
          const div = document.createElement("div");
          div.className = `square ${this.cube[faceIndex][rowIndex][columnIndex]}`;

          const span = document.createElement("span");
          span.className = faceColors[face];
          div.appendChild(span);
          cubeContainer.appendChild(div);
        });
      });
    });
  }

  isCubeSolved() {
    const faces = ["F", "L", "B", "R", "U", "D"];
    let allSquare = document.querySelectorAll(".square");

    for (const face of faces) {
      let refSpan = document.querySelector(`.${face}tr > span`);
      let refColor = refSpan.classList[0];

      for (const square of allSquare) {
        if (square.classList[1].startsWith(face)) {
          let currentSpan = document.querySelector(
            `.${square.classList[1]} > span`
          );
          let currentColor = currentSpan.classList[0];

          if (currentColor !== refColor) {
            return false;
          }
        }
      }
    }
    this.isSolved = true;
    this.stopTimer();
    return true;
  }

  startTimer() {
    this.startTime = Date.now() - this.elapsedTime;
    this.timer = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay();
    }, 10);
    this.isTiming = true;
  }

  stopTimer() {
    clearInterval(this.timer);
    this.isTiming = false;
  }

  updateTimerDisplay() {
    const time = this.elapsedTime;
    const ms = time % 1000;
    const s = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / (1000 * 60)) % 60);
    const h = Math.floor((time / (1000 * 60 * 60)) % 24);

    let displayTime = "";

    if (h > 0) {
      displayTime += `<span>${h} h&nbsp;:&nbsp;</span>`;
    }
    if (min > 0 || h > 0) {
      displayTime += `<span>${min} m&nbsp;:&nbsp;</span>`;
    }
    displayTime += `<span>${s} s&nbsp;:&nbsp;</span><span>${ms} ms</span>`;

    document.querySelector("#timer #time").innerHTML = displayTime;
  }
  // MOUVEMENT METHODS

  rotateFace(face, reverse) {
    const temp = reverse
      ? [
          [face[0][2], face[1][2], face[2][2]],
          [face[0][1], face[1][1], face[2][1]],
          [face[0][0], face[1][0], face[2][0]],
        ]
      : [
          [face[2][0], face[1][0], face[0][0]],
          [face[2][1], face[1][1], face[0][1]],
          [face[2][2], face[1][2], face[0][2]],
        ];
    face[0] = temp[0];
    face[1] = temp[1];
    face[2] = temp[2];
  }

  moveL(reverse) {
    this.rotateFace(this.leftFace, reverse);

    let upEdge = this.upFace.map((row) => row[0]);
    let frontEdge = this.frontFace.map((row) => row[0]);
    let downEdge = this.downFace.map((row) => row[0]);
    let backEdge = this.backFace.map((row) => row[2]).reverse();

    if (reverse) {
      upEdge = upEdge.reverse();
      for (let i = 0; i < 3; i++) this.upFace[i][0] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][0] = downEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][0] = backEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][2] = upEdge[i];
    } else {
      downEdge = downEdge.reverse();
      for (let i = 0; i < 3; i++) this.upFace[i][0] = backEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][0] = upEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][0] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][2] = downEdge[i];
    }
  }

  moveM(reverse) {
    // save edges
    let upEdge = this.upFace.map((row) => row[1]).reverse();
    let frontEdge = this.frontFace.map((row) => row[1]);
    let downEdge = this.downFace.map((row) => row[1]);
    let backEdge = this.backFace.map((row) => row[1]).reverse();

    // update edges
    if (reverse) {
      for (let i = 0; i < 3; i++) this.upFace[i][1] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][1] = downEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][1] = backEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][1] = upEdge[i];
    } else {
      downEdge = downEdge.reverse();
      upEdge = upEdge.reverse();
      for (let i = 0; i < 3; i++) this.upFace[i][1] = backEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][1] = upEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][1] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][1] = downEdge[i];
    }
  }

  moveR(reverse) {
    // rotate right face
    this.rotateFace(this.rightFace, !reverse);

    // save edges
    let upEdge = this.upFace.map((row) => row[2]);
    let frontEdge = this.frontFace.map((row) => row[2]);
    let downEdge = this.downFace.map((row) => row[2]);
    let backEdge = this.backFace.map((row) => row[0]).reverse();

    // update edges
    if (reverse) {
      upEdge = upEdge.reverse();
      for (let i = 0; i < 3; i++) this.upFace[i][2] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][2] = downEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][2] = backEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][0] = upEdge[i];
    } else {
      downEdge = downEdge.reverse();
      for (let i = 0; i < 3; i++) this.upFace[i][2] = backEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][2] = upEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][2] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][0] = downEdge[i];
    }
  }

  moveU(reverse) {
    // Rotate up face
    this.rotateFace(this.upFace, reverse);

    // Save edges
    let frontEdge = this.frontFace[0].slice();
    let rightEdge = this.rightFace[0].slice();
    let backEdge = this.backFace[0].slice();
    let leftEdge = this.leftFace[0].slice();

    // Update edges
    if (reverse) {
      this.frontFace[0] = leftEdge;
      this.rightFace[0] = frontEdge;
      this.backFace[0] = rightEdge;
      this.leftFace[0] = backEdge;
    } else {
      this.frontFace[0] = rightEdge;
      this.rightFace[0] = backEdge;
      this.backFace[0] = leftEdge;
      this.leftFace[0] = frontEdge;
    }
  }

  moveE(reverse) {
    // Save edges
    let frontEdge = this.frontFace[1].slice();
    let rightEdge = this.rightFace[1].slice();
    let backEdge = this.backFace[1].slice();
    let leftEdge = this.leftFace[1].slice();

    // Update edges
    if (reverse) {
      this.frontFace[1] = leftEdge;
      this.rightFace[1] = frontEdge;
      this.backFace[1] = rightEdge;
      this.leftFace[1] = backEdge;
    } else {
      this.frontFace[1] = rightEdge;
      this.rightFace[1] = backEdge;
      this.backFace[1] = leftEdge;
      this.leftFace[1] = frontEdge;
    }
  }

  moveD(reverse) {
    // Rotate down face
    this.rotateFace(this.downFace, !reverse);

    // Save edges
    let frontEdge = this.frontFace[2].slice();
    let rightEdge = this.rightFace[2].slice();
    let backEdge = this.backFace[2].slice();
    let leftEdge = this.leftFace[2].slice();

    // Update edges
    if (reverse) {
      this.frontFace[2] = leftEdge;
      this.rightFace[2] = frontEdge;
      this.backFace[2] = rightEdge;
      this.leftFace[2] = backEdge;
    } else {
      this.frontFace[2] = rightEdge;
      this.rightFace[2] = backEdge;
      this.backFace[2] = leftEdge;
      this.leftFace[2] = frontEdge;
    }
  }

  moveF(reverse) {
    // Rotate front face
    this.rotateFace(this.frontFace, !reverse);

    // Save edges
    let upEdge = this.upFace[2].slice();
    let rightEdge = this.rightFace.map((row) => row[0]);
    let downEdge = this.downFace[0].slice();
    let leftEdge = this.leftFace.map((row) => row[2]);

    // Update edges
    if (reverse) {
      this.upFace[2] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) this.rightFace[i][0] = upEdge[i];
      this.downFace[0] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) this.leftFace[i][2] = downEdge[i];
    } else {
      downEdge = downEdge.reverse();
      upEdge = upEdge.reverse();

      this.upFace[2] = rightEdge;
      for (let i = 0; i < 3; i++) this.rightFace[i][0] = downEdge[i];
      this.downFace[0] = leftEdge;
      for (let i = 0; i < 3; i++) this.leftFace[i][2] = upEdge[i];
    }
  }

  moveS(reverse) {
    // Save edges
    let upEdge = this.upFace[1].slice();
    let rightEdge = this.rightFace.map((row) => row[1]);
    let downEdge = this.downFace[1].slice();
    let leftEdge = this.leftFace.map((row) => row[1]);

    // Update edges
    if (reverse) {
      this.upFace[1] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) this.rightFace[i][1] = upEdge[i];
      this.downFace[1] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) this.leftFace[i][1] = downEdge[i];
    } else {
      upEdge = upEdge.reverse();
      downEdge = downEdge.reverse();

      this.upFace[1] = rightEdge;
      for (let i = 0; i < 3; i++) this.rightFace[i][1] = downEdge[i];
      this.downFace[1] = leftEdge;
      for (let i = 0; i < 3; i++) this.leftFace[i][1] = upEdge[i];
    }
  }

  moveB(reverse) {
    // Rotate back face
    this.rotateFace(this.backFace, reverse);

    // Save edges
    let upEdge = this.upFace[0].slice();
    let rightEdge = this.rightFace.map((row) => row[2]);
    let downEdge = this.downFace[2].slice();
    let leftEdge = this.leftFace.map((row) => row[0]);

    // Update edges
    if (reverse) {
      this.upFace[0] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) this.rightFace[i][2] = upEdge[i];
      this.downFace[2] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) this.leftFace[i][0] = downEdge[i];
    } else {
      upEdge = upEdge.reverse();
      downEdge = downEdge.reverse();

      this.upFace[0] = rightEdge;
      for (let i = 0; i < 3; i++) this.rightFace[i][2] = downEdge[i];
      this.downFace[2] = leftEdge;
      for (let i = 0; i < 3; i++) this.leftFace[i][0] = upEdge[i];
    }
  }
}
