let cube = [
  [
    ["Ftl", "Ftc", "Ftr"],
    ["Fml", "Fmc", "Fmr"],
    ["Fbl", "Fbc", "Fbr"],
  ],
  [
    ["Ltl", "Ltc", "Ltr"],
    ["Lml", "Lmc", "Lmr"],
    ["Lbl", "Lbc", "Lbr"],
  ],
  [
    ["Btl", "Btc", "Btr"],
    ["Bml", "Bmc", "Bmr"],
    ["Bbl", "Bbc", "Bbr"],
  ],
  [
    ["Rtl", "Rtc", "Rtr"],
    ["Rml", "Rmc", "Rmr"],
    ["Rbl", "Rbc", "Rbr"],
  ],
  [
    ["Utl", "Utc", "Utr"],
    ["Uml", "Umc", "Umr"],
    ["Ubl", "Ubc", "Ubr"],
  ],
  [
    ["Dtl", "Dtc", "Dtr"],
    ["Dml", "Dmc", "Dmr"],
    ["Dbl", "Dbc", "Dbr"],
  ],
];

let refCube = [
  [
    [
      ["Ftl", "LFU"],
      ["Ftc", "MFU"],
      ["Ftr", "RFU"],
    ],
    [
      ["Fml", "LFE"],
      ["Fmc", "MFE"],
      ["Fmr", "RFE"],
    ],
    [
      ["Fbl", "LFD"],
      ["Fbc", "MFD"],
      ["Fbr", "RFD"],
    ],
  ],
  [
    [
      ["Ltl", "LUB"],
      ["Ltc", "LUS"],
      ["Ltr", "LFU"],
    ],
    [
      ["Lml", "LEB"],
      ["Lmc", "LES"],
      ["Lmr", "LFE"],
    ],
    [
      ["Lbl", "LDB"],
      ["Lbc", "LDS"],
      ["Lbr", "LFD"],
    ],
  ],
  [
    [
      ["Btl", "RUB"],
      ["Btc", "MUB"],
      ["Btr", "LUB"],
    ],
    [
      ["Bml", "REB"],
      ["Bmc", "MEB"],
      ["Bmr", "LEB"],
    ],
    [
      ["Bbl", "RDB"],
      ["Bbc", "MDB"],
      ["Bbr", "LDB"],
    ],
  ],
  [
    [
      ["Rtl", "RFU"],
      ["Rtc", "RUS"],
      ["Rtr", "RUB"],
    ],
    [
      ["Rml", "RFE"],
      ["Rmc", "RES"],
      ["Rmr", "REB"],
    ],
    [
      ["Rbl", "RFD"],
      ["Rbc", "RDS"],
      ["Rbr", "RDB"],
    ],
  ],
  [
    [
      ["Utl", "LUB"],
      ["Utc", "MUB"],
      ["Utr", "RUB"],
    ],
    [
      ["Uml", "LUS"],
      ["Umc", "MUS"],
      ["Umr", "RUS"],
    ],
    [
      ["Ubl", "LUF"],
      ["Ubc", "FMU"],
      ["Ubr", "FRU"],
    ],
  ],
  [
    [
      ["Dtl", "LFD"],
      ["Dtc", "MFD"],
      ["Dtr", "RFD"],
    ],
    [
      ["Dml", "LDS"],
      ["Dmc", "MDS"],
      ["Dmr", "RDS"],
    ],
    [
      ["Dbl", "LDB"],
      ["Dbc", "MDB"],
      ["Dbr", "RDB"],
    ],
  ],
];

window.addEventListener(
  "DOMContentLoaded",
  () => {
    // displayMouseCoord();
    // setInterval(displayCubeTransform, 100);
    generateCubeHTML(cube);
    getSquare();
    let allSquare = document.querySelectorAll(".square");
    let displayTag = document.querySelector("#tag");
    allSquare.forEach((square) => {
      // setMovePossible(square);

      //  add event to get and display coordinate of clicked square
      //  (probable futur use to detect relative movement)
      square.addEventListener("mousedown", () => {
        let rect = square.getBoundingClientRect();
        let face = square.classList[1];
        displayTag.innerHTML = `${face}</br>squareX: ${rect.left.toFixed(
          2
        )}</br>squareY: ${rect.top.toFixed(2)}`;
      });
      square.style.transition = "rotate ease 0.5s";
    });
  },
  false
);

function displayMouseCoord() {
  const box = document.querySelector("html");

  box.addEventListener("mousemove", updateDisplay, false);
  box.addEventListener("mouseenter", updateDisplay, false);
  box.addEventListener("mouseleave", updateDisplay, false);
}

function updateDisplay(event) {
  const pageX = document.getElementById("x");
  const pageY = document.getElementById("y");
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}

// display cube rotation to set relative face
function displayCubeTransform() {
  let cube = document.querySelector(".cube");
  let cubeTransform = document.querySelector("#cubeTransform");
  let matrix = window.getComputedStyle(cube).transform;
  let values = matrix.split("(")[1].split(")")[0].split(","),
    y = ((Math.asin(parseFloat(values[8])) * 180) / Math.PI).toFixed(1),
    x = (
      (Math.asin(-parseFloat(values[9]) / Math.cos((y * Math.PI) / 180)) *
        180) /
      Math.PI
    ).toFixed(1),
    z = (
      (Math.acos(parseFloat(values[0]) / Math.cos((y * Math.PI) / 180)) * 180) /
      Math.PI
    ).toFixed(1);

  rotX = x;
  rotY = y;
  rotZ = z;

  // cubeTransform.innerHTML = `cubeX : ${rotX}</br>cubeY : ${rotY}`;
}

// display cube rotation to set relative face
function getTransform(element) {
  let matrix = window.getComputedStyle(element).transform;
  let values = matrix.split("(")[1].split(")")[0].split(",");

  let rY = ((Math.asin(parseFloat(values[8])) * 180) / Math.PI).toFixed(1);

  let rX = (
    (Math.asin(-parseFloat(values[9]) / Math.cos((rY * Math.PI) / 180)) * 180) /
    Math.PI
  ).toFixed(1);

  let rZ = (
    (Math.acos(parseFloat(values[0]) / Math.cos((rY * Math.PI) / 180)) * 180) /
    Math.PI
  ).toFixed(1);

  let tY = values[13];
  let tX = values[12];
  let tZ = values[14];

  return { rX: rX, rY: rY, rZ: rZ, tX: tX, tY: tY, tZ: tZ };
}

// prevent mess up animation
let isAnimate = false;

function rotateGroupe(move, reverse = false) {
  let axis = "";
  if (!isAnimate) {
    isAnimate = true;
    let deg = -90;
    if (reverse) {
      deg = 90;
    }
    if ((move == "L") | (move == "M") | (move == "R")) {
      axis = "x";
    } else if ((move == "U") | (move == "E") | (move == "D")) {
      axis = "y";
    } else if ((move == "F") | (move == "S") | (move == "B")) {
      axis = "z";
    }

    let group = document.querySelectorAll(`.${move}`);
    group.forEach((square) => {
      let angle = window.getComputedStyle(square).rotate;
      if (angle != "none") {
        angle = parseInt(angle.match(/[-]?\d+/g).join(""));
      } else {
        angle = 0;
      }
      let newAngle = angle + deg;
      square.style.rotate = `${axis} ${newAngle}deg`;
    });

    switch (move) {
      case "F":
        moveF(cube);
        break;
      case "U":
        moveU(cube);
        break;

      default:
        console.log("function not ready");

        break;
    }
    // getSquare();

    setTimeout(() => {
      isAnimate = false;
    }, 500);
  }
}

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
        span.textContent = `${cube[faceIndex][rowIndex][columnIndex]}`;

        div.appendChild(span);
        cubeContainer.appendChild(div);
      });
    });
  });
}

function getSquare() {
  let moveList = [
    [
      ["LFU", "MFU", "RFU"],
      ["LFE", "MFE", "RFE"],
      ["LFD", "MFD", "RFD"],
    ], // FRONT
    [
      ["LUB", "LUS", "LFU"],
      ["LEB", "LES", "LFE"],
      ["LDB", "LDS", "LFD"],
    ], // LEFT
    [
      ["RUB", "MUB", "LUB"],
      ["REB", "MEB", "LEB"],
      ["RDB", "MDB", "LDB"],
    ], // BACK
    [
      ["RFU", "RUS", "RUB"],
      ["RFE", "RES", "REB"],
      ["RFD", "RDS", "RDB"],
    ], // RIGHT
    [
      ["LUB", "MUB", "RUB"],
      ["LUS", "MUS", "RUS"],
      ["LUF", "FMU", "FRU"],
    ], // UP
    [
      ["LFD", "MFD", "RFD"],
      ["LDS", "MDS", "RDS"],
      ["LDB", "MDB", "RDB"],
    ], // DOWN
  ];
  // for each face
  for (let face = 0; face < cube.length; face++) {
    // for each row
    for (let row = 0; row < cube[face].length; row++) {
      // for each column
      for (let column = 0; column < cube[face][row].length; column++) {
        // get the element name
        const element = cube[face][row][column];
        // select the corresponding html element
        let square = document.querySelector(`.${element}`);
        // remove old movement classes
        let baseClass = `${square.classList[0]} ${square.classList[1]}`;
        square.classList = baseClass;
        // add new movement classes
        for (let j = 0; j < moveList[face][row][column].length; j++) {
          square.classList.add(moveList[face][row][column][j]);
        }
      }
    }
  }
}
const moveList = [
  [
    ["LFU", "MFU", "RFU"],
    ["LFE", "MFE", "RFE"],
    ["LFD", "MFD", "RFD"],
  ], // FRONT
  [
    ["LUB", "LUS", "LFU"],
    ["LEB", "LES", "LFE"],
    ["LDB", "LDS", "LFD"],
  ], // LEFT
  [
    ["RUB", "MUB", "LUB"],
    ["REB", "MEB", "LEB"],
    ["RDB", "MDB", "LDB"],
  ], // BACK
  [
    ["RFU", "RUS", "RUB"],
    ["RFE", "RES", "REB"],
    ["RFD", "RDS", "RDB"],
  ], // RIGHT
  [
    ["LUB", "MUB", "RUB"],
    ["LUS", "MUS", "RUS"],
    ["LUF", "FMU", "FRU"],
  ], // UP
  [
    ["LFD", "MFD", "RFD"],
    ["LDS", "MDS", "RDS"],
    ["LDB", "MDB", "RDB"],
  ], // DOWN
];


// let refCube = [];
// for (let face = 0; face < cube.length; face++) {
//   let newFace = [];
//   for (let row = 0; row < cube[face].length; row++) {
//     let newRow = [];
//     for (let col = 0; col < cube[face][row].length; col++) {
//       newRow.push([cube[face][row][col], moveList[face][row][col]]);
//     }
//     newFace.push(newRow);
//   }
//   refCube.push(newFace);
// }
// console.log("🚀 ~ refCube:", refCube);

// Update the classes of elements affected by the rotation
function updateClasses(face, cube) {
  // Loop through the rotated face
  for (let row = 0; row < cube[face].length; row++) {
    for (let col = 0; col < cube[face][row].length; col++) {
      const element = cube[face][row][col]; // Get the element name
      let square = document.querySelector(`.${element}`); // Select corresponding HTML element

      if (square) {
        // Update classes
        let baseClass = `${square.classList[0]} ${square.classList[1]}`;
        square.classList = baseClass;

        // Add new movement classes
        const movements = moveList[face][row][col];
        for (let j = 0; j < moveList[face][row][col].length; j++) {
          square.classList.add(moveList[face][row][col][j]);
        }
      }
    }
  }
}

// Update the transform property of affected elements
function updateTransforms(face, cube) {
  // Define new transforms for the rotated face
  const newTransforms = [
    ["rotateX(90deg)", "rotateX(90deg)", "rotateX(90deg)"],
    ["rotateX(90deg)", "rotateX(90deg)", "rotateX(90deg)"],
    ["rotateX(90deg)", "rotateX(90deg)", "rotateX(90deg)"],
  ]; // Example: adjust this based on your specific rotation logic

  // Loop through the rotated face
  for (let row = 0; row < cube[face].length; row++) {
    for (let col = 0; col < cube[face][row].length; col++) {
      const element = cube[face][row][col]; // Get the element name
      let square = document.querySelector(`.${element}`); // Select corresponding HTML element

      if (square) {
        // Update transform property
        square.style.transform = newTransforms[row][col];
      }
    }
  }
}
function rotateFace(face) {
  // todo switch also transform value
  const temp = [
    [face[2][0], face[1][0], face[0][0]], // First column becomes first row (reversed)
    [face[2][1], face[1][1], face[0][1]], // Second column becomes second row (reversed)
    [face[2][2], face[1][2], face[0][2]], // Third column becomes third row (reversed)
  ];
  face[0] = temp[0];
  face[1] = temp[1];
  face[2] = temp[2];
}

function moveF(cube) {
  // Rotate the front face
  rotateFace(cube[0]);
  updateClasses(0, cube);
  // Save edges
  const topEdge = cube[4][2].slice(); // UP last row
  const rightEdge = cube[3].map((row) => row[0]);
  const bottomEdge = cube[5][0].slice();
  const leftEdge = cube[1].map((row) => row[2]);

  // Update edges
  cube[4][2] = leftEdge.reverse();
  for (let i = 0; i < 3; i++) cube[3][i][0] = topEdge[i];
  cube[5][0] = rightEdge.reverse();
  for (let i = 0; i < 3; i++) cube[1][i][2] = bottomEdge[i];
}

function moveU(cube) {
  // Rotate the top face
  rotateFace(cube[4]);

  // Save edges
  const frontEdge = cube[0][0].slice();
  const rightEdge = cube[3][0].slice();
  const backEdge = cube[2][0].slice();
  const leftEdge = cube[1][0].slice();

  // Update edges
  cube[0][0] = rightEdge;
  cube[3][0] = backEdge;
  cube[2][0] = leftEdge;
  cube[1][0] = frontEdge;
}

// /**
//  * Selects all "square" and assigns movement classes ('L', 'M', 'R', 'U', 'E', 'D', 'F')
//  * to each element based on its position, indicating the possible moves for that element.
//  *
//  * Movements are relative to the FRONT face
//  */
// function setMovePossible(square) {
//     let face = square.classList[1][0]; // L M R U E D F
//     let row = square.classList[1][1]; // t m b
//     let column = square.classList[1][2]; // l c r

//     // select movable squares for each moves
//     let Lmove =
//       (face == "L") |
//       (((face == "F") | (face == "U") | (face == "D")) & (column == "l")) |
//       ((face == "B") & (column == "r"));
//     let Mmove =
//       ((face == "F") | (face == "D") | (face == "B") | (face == "U")) &
//       (column == "c");
//     let Rmove =
//       (face == "R") |
//       (((face == "F") | (face == "U") | (face == "D")) & (column == "r")) |
//       ((face == "B") & (column == "l"));

//     let Umove =
//       (face == "U") |
//       (((face == "F") | (face == "L") | (face == "B") | (face == "R")) &
//         (row == "t"));
//     let Emove =
//       ((face == "F") | (face == "R") | (face == "B") | (face == "L")) &
//       (row == "m");
//     let Dmove =
//       (face == "D") |
//       (((face == "F") | (face == "L") | (face == "B") | (face == "R")) &
//         (row == "b"));

//     let Fmove =
//       (face == "F") |
//       ((face == "D") & (row == "t")) |
//       ((face == "L") & (column == "r")) |
//       ((face == "U") & (row == "b")) |
//       ((face == "R") & (column == "l"));

//       let Smove = ((face == "D") & (row == "m")) |
//       ((face == "L") & (column == "c")) |
//       ((face == "U") & (row == "m")) |
//     ((face == "R") & (column == "c"));

//       let Bmove =
//         (face == "B") |
//         ((face == "D") & (row == "b")) |
//         ((face == "L") & (column == "l")) |
//         ((face == "U") & (row == "t")) |
//     ((face == "R") & (column == "r"));

//     // set movements
//     if (Lmove) {
//       square.classList.add("L");
//     }
//     if (Mmove) {
//       square.classList.add("M");
//     }
//     if (Rmove) {
//       square.classList.add("R");
//     }
//     if (Umove) {
//       square.classList.add("U");
//     }
//     if (Emove) {
//       square.classList.add("E");
//     }
//     if (Dmove) {
//       square.classList.add("D");
//     }
//     if (Fmove) {
//       square.classList.add("F");
//     }
//     if (Smove) {
//       square.classList.add("S");
//     }
//     if (Bmove) {
//       square.classList.add("B");
//     }
// }
