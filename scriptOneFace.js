let rotateX = -20;
let rotateY = -20;

let lastMouseX = 0;
let lastMouseY = 0;

// global variable used to move groupe or the whole cube
// click on square ??
let isSquare = null;

// MOUSE EVENT
document.addEventListener("mousedown", function (ev) {
  lastMouseX = ev.clientX;
  lastMouseY = ev.clientY;

  let squareClicked =
    ev.target.tagName === "SPAN" &&
    ev.target.parentNode.classList.contains("square");

  isSquare = squareClicked ? ev.target.parentNode : null;

  // rotate the cube
  document.addEventListener("mousemove", pointerMoved);
});

document.addEventListener("mouseup", function () {
  isSquare = null;
  document.removeEventListener("mousemove", pointerMoved);
  // document.removeEventListener("mousemove", groupeMove);
});

// TOUCH EVENT
document.addEventListener("touchstart", function (ev) {
  lastMouseX = ev.touches[0].clientX;
  lastMouseY = ev.touches[0].clientY;

  let squareClicked =
    ev.target.tagName === "SPAN" &&
    ev.target.parentNode.classList.contains("square");

  isSquare = squareClicked ? ev.target.parentNode : null;

  // rotate the cube
  document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
    passive: false,
  });
  document.addEventListener("touchmove", pointerMoved);
});

document.addEventListener("touchend", function () {
  isSquare = null;
  document.removeEventListener("touchmove", pointerMoved);
});

// POINTER MOVE
function pointerMoved(ev) {
  let clientX, clientY;

  if (ev.type === "mousemove") {
    clientX = ev.clientX;
    clientY = ev.clientY;
  } else if (ev.type === "touchmove") {
    clientX = ev.touches[0].clientX;
    clientY = ev.touches[0].clientY;
  }

  let deltaX = clientX - lastMouseX;
  let deltaY = clientY - lastMouseY;

  if (isSquare) {
    let triggerDistance = 80
    // F B 
    // L R
    // U D
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > triggerDistance) {
        // 
        if (deltaX > 0) {
          // RIGHT
          rotateGroupe(isSquare.classList[3], true)
        } else {
          // LEFT
          rotateGroupe(isSquare.classList[3])
        }
      }
      // 
    } else {
      if (Math.abs(deltaY) > minDistance) {
        if (deltaY > 0) {
          // DOWN
        } else {
          // LEFT
        }
      }
    }
  } else {
    lastMouseX = clientX;
    lastMouseY = clientY;

    rotateX += deltaY * -0.5;
    rotateY -= deltaX * -0.5;
    rotateCube();
  }
}

// ROTATE CUBE
function rotateCube() {
  let cube = document.querySelector(".cube");
  cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // watch cube rotation to set relative face
  // let cubeTransform = document.querySelector('#cubeTransform')
  // cubeTransform.innerHTML = window.getComputedStyle(cube).transform
}


function displayMouseCoord() {
  document.addEventListener("mousemove", updateDisplay);
  document.addEventListener("mouseenter", updateDisplay);
  document.addEventListener("mouseleave", updateDisplay);
}

function updateDisplay(event) {
  const pageX = document.getElementById("x");
  const pageY = document.getElementById("y");
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}
const refCube = [
  [
    ["Ftl L U F", "Ftc M U F", "Ftr R U F"],
    ["Fml L E F", "Fmc M E F", "Fmr R E F"],
    ["Fbl L D F", "Fbc M D F", "Fbr R D F"],
  ],
  [
    ["Ltl L U B", "Ltc L U S", "Ltr L U F"],
    ["Lml L E B", "Lmc L E S", "Lmr L E F"],
    ["Lbl L D B", "Lbc L D S", "Lbr L D F"],
  ],
  [
    ["Btl R U B", "Btc M U B", "Btr L U B"],
    ["Bml R E B", "Bmc M E B", "Bmr L E B"],
    ["Bbl R D B", "Bbc M D B", "Bbr L D B"],
  ],
  [
    ["Rtl R U F", "Rtc R U S", "Rtr R U B"],
    ["Rml R E F", "Rmc R E S", "Rmr R E B"],
    ["Rbl R D F", "Rbc R D S", "Rbr R D B"],
  ],
  [
    ["Utl L U B", "Utc M U B", "Utr R U B"],
    ["Uml L U S", "Umc M U S", "Umr R U S"],
    ["Ubl L U F", "Ubc M U F", "Ubr R U F"],
  ],
  [
    ["Dtl L F D", "Dtc M D F", "Dtr R D F"],
    ["Dml L D S", "Dmc M D S", "Dmr R D S"],
    ["Dbl L D B", "Dbc M D B", "Dbr R D B"],
  ],
];


// create a deep copy (modify cube doesn't modify refCube)
// const cube = refCube.slice(); // DID NOT WORK
let cube = JSON.parse(JSON.stringify(refCube));
let frontFace = cube[0];
let leftFace = cube[1];
let backFace = cube[2];
let rightFace = cube[3];
let upFace = cube[4];
let downFace = cube[5];

window.addEventListener(
  "DOMContentLoaded",
  () => {
    displayMouseCoord();
    // setInterval(displayCubeTransform, 100);

    generateCubeHTML(cube);
    // let allSquare = document.querySelectorAll(".square");
    // // let displayTag = document.querySelector("#tag");

    // allSquare.forEach((square) => {
    //   //   // setMovePossible(square);

    //   //   //  add event to get and display coordinate of clicked square
    //   //   //  (probable futur use to detect relative movement)
    //   // square.addEventListener("mousedown", () => {
    //   //   let face = square.classList[1];
    //   //   displayTag.innerHTML = `${face}</br>n/a</br>n/a</br>n/a`;
    //   // });
    //   //   square.style.transition = "rotate ease 0.5s";
    // });
  },
  false
);

function generateCubeHTML(cube) {
  const faceColors = {
    front: "blue",
    up: "white",
    left: "red",
    right: "orange",
    back: "green",
    bottom: "yellow",
  };
  // same order than cube
  const faceNames = ["front", "left", "back", "right", "up", "bottom"];
  const cubeContainer = document.querySelector(".cube");

  faceNames.forEach((face, faceIndex) => {
    cube[faceIndex].forEach((row, rowIndex) => {
      row.forEach((element, columnIndex) => {
        const div = document.createElement("div");
        div.className = `square ${cube[faceIndex][rowIndex][columnIndex]}`;

        const span = document.createElement("span");
        span.className = faceColors[face];
        // span.textContent = `${cube[faceIndex][rowIndex][columnIndex]}`;

        div.appendChild(span);
        cubeContainer.appendChild(div);
      });
    });
  });
}

// prevent mess up animation
let isAnimate = false;

function rotateGroupe(move, reverse = false) {
  // 1. visual rotation
  if (!isAnimate) {
    isAnimate = true;
    let deg = "-";
    if (reverse) {
      deg = "";
    }
    if ((move == "L") | (move == "M") | (move == "R")) {
      deg += "x";
    } else if ((move == "U") | (move == "E") | (move == "D")) {
      deg += "y";
    } else if ((move == "F") | (move == "S") | (move == "B")) {
      deg += "z";
    }

    let group = document.querySelectorAll(`.${move}`);
    group.forEach((square) => {
      square.style.transition = "rotate ease 0.5s";
      square.classList.add(deg);
    });

    // 2. do the corresponding rotation in the cube matrice
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

    // 3. wait the end of animation and reassign square position using refCube
    setTimeout(() => {
      setNewPos();
      isAnimate = false;
    }, 500);
  }
}

function setNewPos() {
  // for each face
  for (let face = 0; face < cube.length; face++) {
    // for each row
    for (let row = 0; row < cube[face].length; row++) {
      // for each column
      for (let column = 0; column < cube[face][row].length; column++) {
        // get reference
        let refSquare = refCube[face][row][column].split(" ");

        // get the element name
        let movedSquare = cube[face][row][column].split(" ");

        // select the corresponding html element
        let squareList = document.querySelectorAll(`.${movedSquare[0]}`);
        squareList.forEach((square) => {
          if (square.classList[0] != "temp") {
            square.style.transition = "";
            // remove old movement classe
            // + add a temp class to avoid duplicate and prevent reselection of an element already modified during the loop
            let baseClass = `temp square `;
            square.classList = baseClass;
            // square.children[0].innerText = refCube[face][row][column];
            // add new movement classes
            for (let j = 0; j < refSquare.length; j++) {
              square.classList.add(refSquare[j]);
            }
          }
        });
      }
    }
  }
  // remove the temp class
  let clean = document.querySelectorAll(".square");
  clean.forEach((element) => {
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
  let temp = [
    [face[2][0], face[1][0], face[0][0]], // First column becomes first row (reversed)
    [face[2][1], face[1][1], face[0][1]], // Second column becomes second row (reversed)
    [face[2][2], face[1][2], face[0][2]], // Third column becomes third row (reversed)
  ];
  if (reverse) {
    temp = [
      [face[0][2], face[1][2], face[2][2]], // last column becomes first row (reversed)
      [face[0][1], face[1][1], face[2][1]], // Second column becomes second row (reversed)
      [face[0][0], face[1][0], face[2][0]], // Third column becomes third row (reversed)
    ];
  }
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
    for (let i = 0; i < 3; i++) upFace[i][0] = frontEdge[i];
    for (let i = 0; i < 3; i++) frontFace[i][0] = downEdge[i];
    for (let i = 0; i < 3; i++) downFace[i][0] = backEdge[i];
    for (let i = 0; i < 3; i++) backFace[i][2] = upEdge[i];
  } else {
    for (let i = 0; i < 3; i++) upFace[i][0] = backEdge[i];
    for (let i = 0; i < 3; i++) frontFace[i][0] = upEdge[i];
    for (let i = 0; i < 3; i++) downFace[i][0] = frontEdge[i];
    for (let i = 0; i < 3; i++) backFace[i][2] = downEdge[i];
  }
}

function moveM(reverse) {
  // save edges
  let upEdge = upFace.map((row) => row[1]);
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
    for (let i = 0; i < 3; i++) upFace[i][1] = backEdge[i];
    for (let i = 0; i < 3; i++) frontFace[i][1] = upEdge[i];
    for (let i = 0; i < 3; i++) downFace[i][1] = frontEdge[i];
    for (let i = 0; i < 3; i++) backFace[i][1] = downEdge[i];
  }
}

function moveR(reverse) {
  // rotate left face
  rotateFace(rightFace, !reverse);

  // save edges
  let upEdge = upFace.map((row) => row[2]);
  let frontEdge = frontFace.map((row) => row[2]);
  let downEdge = downFace.map((row) => row[2]);
  let backEdge = backFace.map((row) => row[0]).reverse();

  // update edges
  if (!reverse) {
    for (let i = 0; i < 3; i++) upFace[i][2] = backEdge[i];
    for (let i = 0; i < 3; i++) frontFace[i][2] = upEdge[i];
    for (let i = 0; i < 3; i++) downFace[i][2] = frontEdge[i];
    for (let i = 0; i < 3; i++) backFace[i][0] = downEdge[i];
  } else {
    for (let i = 0; i < 3; i++) upFace[i][2] = frontEdge[i];
    for (let i = 0; i < 3; i++) frontFace[i][2] = downEdge[i];
    for (let i = 0; i < 3; i++) downFace[i][2] = backEdge[i];
    for (let i = 0; i < 3; i++) backFace[i][0] = upEdge[i];
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
  // Rotate up face
  rotateFace(downFace, !reverse);

  // Save edges
  let frontEdge = frontFace[2].slice();
  let rightEdge = rightFace[2].slice();
  let backEdge = backFace[2].slice();
  let leftEdge = leftFace[2].slice();

  // Update edges
  if (!reverse) {
    frontFace[2] = rightEdge;
    rightFace[2] = backEdge;
    backFace[2] = leftEdge;
    leftFace[2] = frontEdge;
  } else {
    frontFace[2] = leftEdge;
    rightFace[2] = frontEdge;
    backFace[2] = rightEdge;
    leftFace[2] = backEdge;
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
  if (!reverse) {
    downEdge = downEdge.reverse();
    upEdge = upEdge.reverse();

    upFace[2] = rightEdge;
    for (let i = 0; i < 3; i++) rightFace[i][0] = downEdge[i];
    downFace[0] = leftEdge;
    for (let i = 0; i < 3; i++) leftFace[i][2] = upEdge[i];
  } else {
    upFace[2] = leftEdge.reverse();
    for (let i = 0; i < 3; i++) rightFace[i][0] = upEdge[i];
    downFace[0] = rightEdge.reverse();
    for (let i = 0; i < 3; i++) leftFace[i][2] = downEdge[i];
  }
}

function moveS(reverse) {
  // Save edges
  let upEdge = upFace[1].slice();
  let rightEdge = rightFace.map((row) => row[1]);
  let downEdge = downFace[1].slice();
  let leftEdge = leftFace.map((row) => row[1]);

  // Update edges
  if (!reverse) {
    upEdge = upEdge.reverse();
    downEdge = downEdge.reverse();

    upFace[1] = rightEdge;
    for (let i = 0; i < 3; i++) rightFace[i][1] = downEdge[i];
    downFace[1] = leftEdge;
    for (let i = 0; i < 3; i++) leftFace[i][1] = upEdge[i];
  } else {
    upFace[1] = leftEdge.reverse();
    for (let i = 0; i < 3; i++) rightFace[i][1] = upEdge[i];
    downFace[1] = rightEdge.reverse();
    for (let i = 0; i < 3; i++) leftFace[i][1] = downEdge[i];
  }
}

function moveB(reverse) {
  // Rotate front face
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
