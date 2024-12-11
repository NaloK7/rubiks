import { cubeEvent } from './src/script.js';

export class Cube {
  constructor() {
    this.rotateX = 335;
    this.rotateY = 315;
    this.rotateZ = 0;
    this.THRESHOLD = 100;
    this.isAnimate = false;

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
      this.applyCubeRotation()
  }

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
    console.log("reset");
    
    const cubeElement = document.querySelector(".cube");
    cubeElement.style.transform = `rotateX(335deg) rotateY(315deg) rotateZ(0deg)`;
  }
  applyCubeRotation() {    
    const cubeElement = document.querySelector(".cube");
    cubeElement.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg)`;
  }

    rotateGroupe(move,reverse = false, speed = 300) {
      
    if (!this.isAnimate) {
      this.isAnimate = true;
      let deg = reverse ? "" : "-";
      deg +=
        move === "L" || move === "M" || move === "R"
          ? "x"
          : move === "U" || move === "E" || move === "D"
          ? "y"
          : "z";
      const blackSquare = document.querySelectorAll(`.blackSquare.${move}`);
      blackSquare.forEach((square) => {
        square.style.backgroundColor = "black";
      });
      const group = document.querySelectorAll(`.${move}`);
      group.forEach((square) => {
        square.style.transition = `rotate ease ${speed*0.001}s`;
        square.classList.add(deg);
      });

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

      cubeEvent.onMouseUp();
      setTimeout(() => {
        this.setNewPos();
        this.isAnimate = false;
        blackSquare.forEach((square) => {
          square.style.backgroundColor = "transparent";
          square.classList.remove(deg);
        });
      }, speed);
    }
  }

  setNewPos() {
    this.cube.forEach((face, faceIndex) => {
      face.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const refSquare = this.refCube[faceIndex][rowIndex][columnIndex].split(" ");
          const movedSquare = this.cube[faceIndex][rowIndex][columnIndex].split(" ");
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
      upEdge = upEdge.reverse()
      for (let i = 0; i < 3; i++) this.upFace[i][2] = frontEdge[i];
      for (let i = 0; i < 3; i++) this.frontFace[i][2] = downEdge[i];
      for (let i = 0; i < 3; i++) this.downFace[i][2] = backEdge[i];
      for (let i = 0; i < 3; i++) this.backFace[i][0] = upEdge[i];
    } else {
      downEdge = downEdge.reverse()
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

  mixCube() {
    const possibleMove = ["L", "M", "R", "U", "E", "D", "F", "S", "B"];
    const sequence = [];
    
    while (sequence.length < 30) {
        const randomElement = possibleMove[Math.floor(Math.random() * possibleMove.length)];
        if (sequence.length === 0 || randomElement !== sequence[sequence.length - 1]) {
            sequence.push(randomElement);
        }
    }
    let index = 0;

    const performMove = () => {
      if (index < sequence.length) {  
        let reverse = Math.random() > 0.5 ? false : true
        this.rotateGroupe(sequence[index], reverse, 200);
        index++;
        setTimeout(performMove, 250);
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
}
