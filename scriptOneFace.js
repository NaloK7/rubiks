// initial cube rotation
let rotateX = -25;
let rotateY = -45;

// pointer coordinates
let startPointer = null;
let currentPointer = null;

// reference vector
let faceHorizontalVector = null;
let faceVerticalVector = null;

// threshold to trigger group rotation
const THRESHOLD = 100;

// global variable to track the selected square
let selectedSquare = null;
// global variable to track animation running
let isAnimate = false;

const refCube = [
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
let cube = JSON.parse(JSON.stringify(refCube));

// face references
let frontFace = cube[0];
let leftFace = cube[1];
let backFace = cube[2];
let rightFace = cube[3];
let upFace = cube[4];
let downFace = cube[5];

// MOUSE & TOUCH HANDLER

// Event listeners for mouse and touch events
function initializeEventListeners() {
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchend", onTouchEnd);
}

function onMouseDown(ev) {
  startPointer = { x: ev.clientX, y: ev.clientY };
  currentPointer = { x: ev.clientX, y: ev.clientY };
  selectedSquare = getSelectedSquare(ev);

  if (selectedSquare) {
    // set reference vectors
    getFaceVectors(selectedSquare);
  }

  document.addEventListener("mousemove", onPointerMove);
}

function resetMouvement() {
  selectedSquare = null;
  startPointer = null;
  currentPointer = null;
  faceHorizontalVector = null;
  faceVerticalVector = null;
}

function onMouseUp() {
  resetMouvement()
  document.removeEventListener("mousemove", onPointerMove);
}

function onTouchStart(ev) {
  startPointer = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  currentPointer = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  selectedSquare = getSelectedSquare(ev);

  if (selectedSquare) {
    getFaceVectors(selectedSquare);
  }
  document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
    passive: false,
  });
  document.addEventListener("touchmove", onPointerMove);
}

function onTouchEnd() {
  selectedSquare = null;
  document.removeEventListener("touchmove", onPointerMove);
}

function getSelectedSquare(ev) {
  const squareClicked =
    ev.target.tagName === "SPAN" &&
    ev.target.parentNode.classList.contains("square");
  return squareClicked ? ev.target.parentNode : null;
}

// VECTOR

function getVectorDirection(vector) {
  return {
    x: vector.end.x - vector.start.x,
    y: vector.end.y - vector.start.y,
  };
}

function vectorMagnitude(vector) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function getCosAngle(vector1, vector2) {
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  const magnitudeProduct = vectorMagnitude(vector1) * vectorMagnitude(vector2);
  return dotProduct / magnitudeProduct;
}

function analyzeVectors(mouseVector, faceVector) {
  const mouseDir = getVectorDirection(mouseVector);
  const faceDir = getVectorDirection(faceVector);

  const cosAngle = getCosAngle(mouseDir, faceDir);
  return cosAngle;
}

// old vector manipulation

function vectorLength(vector) {
  let dx = vector.end.x - vector.start.x;
  let dy = vector.end.y - vector.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getFaceVectors(square) {
  const faceLetter = square.classList[1][0];
  const faceIndex = getFaceIndex(faceLetter);

  if (faceIndex !== -1) {
    faceHorizontalVector = {
      start: { x: getPoint(faceIndex, 1, 0).x, y: getPoint(faceIndex, 1, 0).y },
      end: { x: getPoint(faceIndex, 1, 2).x, y: getPoint(faceIndex, 1, 2).y },
    };
    faceVerticalVector = {
      start: { x: getPoint(faceIndex, 0, 1).x, y: getPoint(faceIndex, 0, 1).y },
      end: { x: getPoint(faceIndex, 2, 1).x, y: getPoint(faceIndex, 2, 1).y },
    };
  }
}

function getPoint(faceIndex, row, col) {
  const select = cube[faceIndex][row][col].split(" ")[0]; // ex: Ftl
  const square = document.querySelector(`.${select}`);
  const squareRect = square.getBoundingClientRect();
  let x = squareRect.left + squareRect.width / 2;
  let y = squareRect.top + squareRect.height / 2;
  return { x, y };
}

function getFaceIndex(faceLetter) {
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

// POINTER MOVE

function onPointerMove(ev) {
  if (ev.type === "mousemove") {
    currentPointer.x = ev.clientX;
    currentPointer.y = ev.clientY;
  } else if (ev.type === "touchmove") {
    currentPointer.x = ev.touches[0].clientX;
    currentPointer.y = ev.touches[0].clientY;
  }

  if (selectedSquare) {
    handleRotationGroup();
  } else {
    handleCubeMovement();
  }
}

function handleCubeMovement() {
  const deltaX = currentPointer.x - startPointer.x;
  const deltaY = currentPointer.y - startPointer.y;

  rotateX += deltaY * -0.5;
  rotateX = rotateX % 360;
  rotateY += deltaX * 0.5;
  rotateY = rotateY % 360;
  
  startPointer.x += deltaX;
  startPointer.y += deltaY;
  applyCubeRotation(rotateX, rotateY);
}


function handleRotationGroup() {
  const mouseVector = {
    start: { x: startPointer.x, y: startPointer.y },
    end: { x: currentPointer.x, y: currentPointer.y },
  };

  if (vectorLength(mouseVector) > THRESHOLD) {
    let moveDirection = "";
    const horizontal = analyzeVectors(mouseVector, faceHorizontalVector);
    const vertical = analyzeVectors(mouseVector, faceVerticalVector);

    if (Math.abs(vertical) > Math.abs(horizontal)) {
      moveDirection = vertical < 0 ? "-v" : "v";
    } else {
      moveDirection = horizontal < 0 ? "-h" : "h";
    }

    const face = selectedSquare.classList[1][0];
    let reverse = false;

    switch (moveDirection) {
      case "h":
        reverse = face === "D";
        rotateGroupe(selectedSquare.classList[3], !reverse);
        break;
      case "-h":
        reverse = face === "D";
        rotateGroupe(selectedSquare.classList[3], reverse);
        break;
      case "v":
        reverse = face === "R" || face === "B";
        rotateGroupe(selectedSquare.classList[2], reverse);
        break;
      case "-v":
        reverse = face === "R" || face === "B";
        rotateGroupe(selectedSquare.classList[2], !reverse);
        break;
    }
    onMouseUp();
  }
}

// VISUAL CUBE ROTATION
function applyCubeRotation(x, y) {
  const cubeElement = document.querySelector(".cube");
  cubeElement.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
}

// GENERATE CUBE
function generateCubeHTML(cube) {
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

// ROTATE GROUPE
function rotateGroupe(move, reverse = false) {
  if (!isAnimate) {
    isAnimate = true;
    let deg = reverse ? "" : "-";
    deg +=
      move === "L" || move === "M" || move === "R"
        ? "x"
        : move === "U" || move === "E" || move === "D"
        ? "y"
        : "z";

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
function displayBtn() {
  let btn = document.querySelector('#displayMoveBtn')
  let aside = document.querySelector('#btn')
  // btn.addEventListener('click', () => {
    const isHidden = aside.style.display === 'none' || aside.style.display === '';
    
    // Toggle the display property of the aside
    aside.style.display = isHidden ? 'block' : 'none';
    
    // Update the button text based on the visibility
    btn.textContent = isHidden ? '<' : '>';
// });
}
// Initialize the cube and event listeners
window.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeEventListeners();
    generateCubeHTML(cube);
  },
  false
);
