window.addEventListener(
  "DOMContentLoaded",
  () => {
    displayMouseCoord();
    setInterval(displayCubeTransform, 100);
    
    let allSquare = document.querySelectorAll(".square");
    let displayTag = document.querySelector("#tag");
    allSquare.forEach((square) => {
      setMovePossible(square);

      //  add event to get and display coordinate of clicked square
      //  (probable futur use to detect relative movement)
      square.addEventListener("mousedown", () => {
        let rect = square.getBoundingClientRect();
        let face = square.classList[2];
        displayTag.innerHTML = `${face}</br>squareX: ${rect.left.toFixed(2)}</br>squareY: ${rect.top.toFixed(2)}`;
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
    // pi = Math.PI,
    // sinB = parseFloat(values[8]),
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

  cubeTransform.innerHTML = `cubeX : ${rotX}</br>cubeY : ${rotY}`;
}

// prevent mess up animation
let isAnimate = false;

function rotateGroupe(move, reverse = false) {
  let axe = "";
  if (!isAnimate) {
    isAnimate = true;
    let deg = -90;
    if (reverse) {
      deg = 90;
    }
    if ((move == "L") | (move == "M") | (move == "R")) {
      axe = "x";
    } else if ((move == "U") | (move == "E") | (move == "D")) {
      axe = "y";
    } else if (move == "F") {
      axe = "z";
    }
    // console.log(axe);
    

    let group = document.querySelectorAll(`.${move}`);

    group.forEach((square) => {
      
      let angle = window.getComputedStyle(square).rotate;
      if (angle != "none") {
        angle = parseInt(angle.match(/[-]?\d+/g).join(""));
      } else {
        angle = 0;
      }
      let newAngle = angle + deg;
      square.style.rotate = `${axe} ${newAngle}deg`;
      console.log(square.classList[2][0], axe);
      
        // resetPosition(square, move);
      }
      // }
    );
    setTimeout(() => {
      isAnimate = false;
    }, 500);
  }
}

/**
 * Selects all "square" and assigns movement classes ('L', 'M', 'R', 'U', 'E', 'D', 'F')
 * to each element based on its position, indicating the possible moves for that element.
 *
 * Movements are relative to the FRONT face
 */
function setMovePossible(square) {
    let face = square.classList[2][0]; // L M R U E D F
    let row = square.classList[2][1]; // t m b
    let column = square.classList[2][2]; // l c r

    // select movable squares for each moves
    let Lmove =
      (face == "L") |
      (((face == "F") | (face == "U") | (face == "D")) & (column == "l")) |
      ((face == "B") & (column == "r"));
    let Mmove =
      ((face == "F") | (face == "D") | (face == "B") | (face == "U")) &
      (column == "c");
    let Rmove =
      (face == "R") |
      (((face == "F") | (face == "U") | (face == "D")) & (column == "r")) |
      ((face == "B") & (column == "l"));

    let Umove =
      (face == "U") |
      (((face == "F") | (face == "L") | (face == "B") | (face == "R")) &
        (row == "t"));
    let Emove =
      ((face == "F") | (face == "R") | (face == "B") | (face == "L")) &
      (row == "m");
    let Dmove =
      (face == "D") |
      (((face == "F") | (face == "L") | (face == "B") | (face == "R")) &
        (row == "b"));

    let Fmove =
      (face == "F") |
      ((face == "D") & (row == "t")) |
      ((face == "L") & (column == "r")) |
      ((face == "U") & (row == "b")) |
      ((face == "R") & (column == "l"));

    // set movements
    if (Lmove) {
      square.classList.add("L");
    }
    if (Mmove) {
      square.classList.add("M");
    }
    if (Rmove) {
      square.classList.add("R");
    }
    if (Umove) {
      square.classList.add("U");
    }
    if (Emove) {
      square.classList.add("E");
    }
    if (Dmove) {
      square.classList.add("D");
    }
    if (Fmove) {
      square.classList.add("F");
    }
}

function resetPosition(square, move) {
  let face = square.classList[2][0];    // L M R U E D F
  let row = square.classList[2][1];     // t m b
  let column = square.classList[2][2];  // l c r

  console.log(square.classList[2]);
  console.log(move);
  if (move == 'L') {
    
  }
}
