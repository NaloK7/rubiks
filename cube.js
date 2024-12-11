import { onMouseUp } from "./event.js";
// initial cube rotation
export let rotateX = 335;
export let rotateY = 315;

// threshold to trigger group rotation
export const THRESHOLD = 100;

// global variable to track animation running
export let isAnimate = false;

export const refCube = [
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
  
// create a deep copy (modify cube doesn't modify refCube)
// const cube = refCube.slice(); // DID NOT WORK
export let cube = JSON.parse(JSON.stringify(refCube));

// face references
export let frontFace = cube[0];
export let leftFace = cube[1];
export let backFace = cube[2];
export let rightFace = cube[3];
export let upFace = cube[4];
export let downFace = cube[5];

export function updateRotateX(value) {
    rotateX = (rotateX + value + 360) % 360;
}
export function updateRotateY(value) {
    rotateY = (rotateY - value + 360) % 360;
}

// VISUAL CUBE ROTATION
export function applyCubeRotation(x, y, z=0) {
    const cubeElement = document.querySelector(".cube");
    cubeElement.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}
  
// ROTATE GROUPE
export function rotateGroupe(move, reverse = false) {
    if (!isAnimate) {
      isAnimate = true;
      let deg = reverse ? "" : "-";
      deg +=
        move === "L" || move === "M" || move === "R"
          ? "x"
          : move === "U" || move === "E" || move === "D"
            ? "y"
            : "z";
      const blackSquare = document.querySelectorAll(`.blackSquare.${move}`);
      blackSquare.forEach((square) => {
        square.style.backgroundColor = "black"
      }
      )
      const group = document.querySelectorAll(`.${move}`);
      group.forEach((square) => {
        square.style.transition = "rotate ease 0.5s";
        square.classList.add(deg);
      });
  
      switch (move) {
        case "L":
          moveL(reverse);
          break;
        case "M":
          moveM(reverse);
          break;
        case "R":
          moveR(reverse);
          break;
        case "U":
          moveU(reverse);
          break;
        case "E":
          moveE(reverse);
          break;
        case "D":
          moveD(reverse);
          break;
        case "F":
          moveF(reverse);
          break;
        case "S":
          moveS(reverse);
          break;
        case "B":
          moveB(reverse);
          break;
        default:
          console.log("function not ready");
          break;
      }
      
      onMouseUp();
      setTimeout(() => {
        setNewPos();
        isAnimate = false;
        blackSquare.forEach((square) => {
          square.style.backgroundColor = "transparent"
        square.classList.remove(deg);
      });
      }, 500);
    }
}
  
function setNewPos() {
    cube.forEach((face, faceIndex) => {
      face.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const refSquare = refCube[faceIndex][rowIndex][columnIndex].split(" ");
          const movedSquare = cube[faceIndex][rowIndex][columnIndex].split(" ");
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
  
    cube = JSON.parse(JSON.stringify(refCube));
    frontFace = cube[0];
    leftFace = cube[1];
    backFace = cube[2];
    rightFace = cube[3];
    upFace = cube[4];
    downFace = cube[5];
  }
  
  function rotateFace(face, reverse) {
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
  
  function moveL(reverse) {
    // rotate left face
    rotateFace(leftFace, reverse);
  
    // save edges
    let upEdge = upFace.map((row) => row[0]);
    let frontEdge = frontFace.map((row) => row[0]);
    let downEdge = downFace.map((row) => row[0]);
    let backEdge = backFace.map((row) => row[2]).reverse();
  
    // update edges
    if (reverse) {
      upEdge = upEdge.reverse()
      for (let i = 0; i < 3; i++) upFace[i][0] = frontEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][0] = downEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][0] = backEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][2] = upEdge[i];
    } else {
      downEdge = downEdge.reverse()
      for (let i = 0; i < 3; i++) upFace[i][0] = backEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][0] = upEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][0] = frontEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][2] = downEdge[i];
    }
  }
  
  function moveM(reverse) {
    // save edges
    let upEdge = upFace.map((row) => row[1]).reverse();
    let frontEdge = frontFace.map((row) => row[1]);
    let downEdge = downFace.map((row) => row[1]);
    let backEdge = backFace.map((row) => row[1]).reverse();
  
    // update edges
    if (reverse) {
      for (let i = 0; i < 3; i++) upFace[i][1] = frontEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][1] = downEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][1] = backEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][1] = upEdge[i];
    } else {
      downEdge = downEdge.reverse();
      upEdge = upEdge.reverse();
      for (let i = 0; i < 3; i++) upFace[i][1] = backEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][1] = upEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][1] = frontEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][1] = downEdge[i];
    }
  }
  
  function moveR(reverse) {
    // rotate right face
    rotateFace(rightFace, !reverse);
  
    // save edges
    let upEdge = upFace.map((row) => row[2]);
    let frontEdge = frontFace.map((row) => row[2]);
    let downEdge = downFace.map((row) => row[2]);
    let backEdge = backFace.map((row) => row[0]).reverse();
  
    // update edges
    if (reverse) {
      upEdge = upEdge.reverse()
      for (let i = 0; i < 3; i++) upFace[i][2] = frontEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][2] = downEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][2] = backEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][0] = upEdge[i];
    } else {
      downEdge = downEdge.reverse()
      for (let i = 0; i < 3; i++) upFace[i][2] = backEdge[i];
      for (let i = 0; i < 3; i++) frontFace[i][2] = upEdge[i];
      for (let i = 0; i < 3; i++) downFace[i][2] = frontEdge[i];
      for (let i = 0; i < 3; i++) backFace[i][0] = downEdge[i];
    }
  }
  
  function moveU(reverse) {
    // Rotate up face
    rotateFace(upFace, reverse);
  
    // Save edges
    let frontEdge = frontFace[0].slice();
    let rightEdge = rightFace[0].slice();
    let backEdge = backFace[0].slice();
    let leftEdge = leftFace[0].slice();
  
    // Update edges
    if (reverse) {
      frontFace[0] = leftEdge;
      rightFace[0] = frontEdge;
      backFace[0] = rightEdge;
      leftFace[0] = backEdge;
    } else {
      frontFace[0] = rightEdge;
      rightFace[0] = backEdge;
      backFace[0] = leftEdge;
      leftFace[0] = frontEdge;
    }
  }
  
  function moveE(reverse) {
    // Save edges
    let frontEdge = frontFace[1].slice();
    let rightEdge = rightFace[1].slice();
    let backEdge = backFace[1].slice();
    let leftEdge = leftFace[1].slice();
  
    // Update edges
    if (reverse) {
      frontFace[1] = leftEdge;
      rightFace[1] = frontEdge;
      backFace[1] = rightEdge;
      leftFace[1] = backEdge;
    } else {
      frontFace[1] = rightEdge;
      rightFace[1] = backEdge;
      backFace[1] = leftEdge;
      leftFace[1] = frontEdge;
    }
  }
  
  function moveD(reverse) {
    // Rotate down face
    rotateFace(downFace, !reverse);
  
    // Save edges
    let frontEdge = frontFace[2].slice();
    let rightEdge = rightFace[2].slice();
    let backEdge = backFace[2].slice();
    let leftEdge = leftFace[2].slice();
  
    // Update edges
    if (reverse) {
      frontFace[2] = leftEdge;
      rightFace[2] = frontEdge;
      backFace[2] = rightEdge;
      leftFace[2] = backEdge;
    } else {
      frontFace[2] = rightEdge;
      rightFace[2] = backEdge;
      backFace[2] = leftEdge;
      leftFace[2] = frontEdge;
    }
  }
  
  function moveF(reverse) {
    // Rotate front face
    rotateFace(frontFace, !reverse);
  
    // Save edges
    let upEdge = upFace[2].slice();
    let rightEdge = rightFace.map((row) => row[0]);
    let downEdge = downFace[0].slice();
    let leftEdge = leftFace.map((row) => row[2]);
  
    // Update edges
    if (reverse) {
      upFace[2] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) rightFace[i][0] = upEdge[i];
      downFace[0] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) leftFace[i][2] = downEdge[i];
    } else {
      downEdge = downEdge.reverse();
      upEdge = upEdge.reverse();
  
      upFace[2] = rightEdge;
      for (let i = 0; i < 3; i++) rightFace[i][0] = downEdge[i];
      downFace[0] = leftEdge;
      for (let i = 0; i < 3; i++) leftFace[i][2] = upEdge[i];
    }
  }
  
  function moveS(reverse) {
    // Save edges
    let upEdge = upFace[1].slice();
    let rightEdge = rightFace.map((row) => row[1]);
    let downEdge = downFace[1].slice();
    let leftEdge = leftFace.map((row) => row[1]);
  
    // Update edges
    if (reverse) {
      upFace[1] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) rightFace[i][1] = upEdge[i];
      downFace[1] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) leftFace[i][1] = downEdge[i];
    } else {
      upEdge = upEdge.reverse();
      downEdge = downEdge.reverse();
  
      upFace[1] = rightEdge;
      for (let i = 0; i < 3; i++) rightFace[i][1] = downEdge[i];
      downFace[1] = leftEdge;
      for (let i = 0; i < 3; i++) leftFace[i][1] = upEdge[i];
    }
  }
  
  function moveB(reverse) {
    // Rotate back face
    rotateFace(backFace, reverse);
  
    // Save edges
    let upEdge = upFace[0].slice();
    let rightEdge = rightFace.map((row) => row[2]);
    let downEdge = downFace[2].slice();
    let leftEdge = leftFace.map((row) => row[0]);
  
    // Update edges
    if (reverse) {
      upFace[0] = leftEdge.reverse();
      for (let i = 0; i < 3; i++) rightFace[i][2] = upEdge[i];
      downFace[2] = rightEdge.reverse();
      for (let i = 0; i < 3; i++) leftFace[i][0] = downEdge[i];
    } else {
      upEdge = upEdge.reverse();
      downEdge = downEdge.reverse();
  
      upFace[0] = rightEdge;
      for (let i = 0; i < 3; i++) rightFace[i][2] = downEdge[i];
      downFace[2] = leftEdge;
      for (let i = 0; i < 3; i++) leftFace[i][0] = upEdge[i];
    }
  }
  
  function shakeCube() {
    const possibleMove = ["L", "M", "R", "U", "E", "D", "F", "S", "B"]
    const randomMoves = Array.from({ length: 15 }, () => 
      possibleMove[Math.floor(Math.random() * possibleMove.length)]
  );
  let index = 0;
  
  function performMove() {
    if (index < randomMoves.length) {
      rotateGroupe(randomMoves[index]); // Effectue le mouvement
      index++;
      setTimeout(performMove, 560); // Appelle le prochain mouvement après 500ms
    }
  }
  
  performMove(); 
}
  // GENERATE CUBE
export function generateCubeHTML() {
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
      cube[faceIndex].forEach((row, rowIndex) => {
        row.forEach((element, columnIndex) => {
          const div = document.createElement("div");
          div.className = `square ${cube[faceIndex][rowIndex][columnIndex]}`;
  
          const span = document.createElement("span");
          span.className = faceColors[face];
  
          div.appendChild(span);
          cubeContainer.appendChild(div);
        });
      });
    });
  
    applyCubeRotation(rotateX, rotateY);
  }