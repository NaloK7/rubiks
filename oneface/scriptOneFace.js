window.addEventListener(
  "DOMContentLoaded",
   () => {
    displayMouseCoord();
    setInterval(displayCubeTransform, 100);
     setMovePossible()
     
     let allCube = document.querySelectorAll(".square");
     let displayTag = document.querySelector('#tag')
     allCube.forEach((cube) => {
      //  get the clicked square coordinate
      //  (probable futur use to detect relative movement)
       cube.addEventListener('click', () => {
        let rect = cube.getBoundingClientRect();         
        let face = [2, 3, 4].map(x=>cube.classList[x])
        displayTag.innerHTML = `${face}</br>squareX: ${rect.left.toFixed(2)}</br>squareY: ${rect.top.toFixed(2)}`
      })
      cube.style.transition = "rotate ease 0.5s";
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

  // let square = document.querySelectorAll('.square')
  // square.forEach(element => {
  //   if (rotY > 45) {
  //     if (element.classList.contains('front')) {
  //       element.classList.remove('front')
  //       element.classList.add('right')
  //     } else if (element.classList.contains('left')) {
  //       element.classList.remove('left')
  //       element.classList.add('front')
  //     } else if (element.classList.contains('back')) {
  //       element.classList.remove('back')
  //       element.classList.add('left')
  //     } else if (element.classList.contains('right')) {
  //       element.classList.remove('right')
  //       element.classList.add('back')
  //     }
  //   }
  //   if (rotX > 45 | rotX < -45) {

  //   }

  // });
}

// prevent mess up animation
let isAnimate = false;

function m_up(move, reverse = false) {
  if (!isAnimate) {
    isAnimate = true;
    let deg = -90;
    if (reverse) {
      deg = 90;
    }
    let axe = ''
    if (move == '.L' | move == '.M' | move == '.R') {
      axe = 'x'
    } else if (move == '.U' | move == '.E' | move == '.D') {
      axe = 'y'
    } else if (move == '.F') {
      axe = 'z'
    }
    let row = document.querySelectorAll(move);

    row.forEach((square) => {
      // if (square.classList.contains("t") | square.classList.contains("up")) {
        // let txt = square.innerHTML;
        // if (square.classList.contains("right")) {
        //   square.innerHTML = txt.replace("right", "front");

        //   console.log(square.classList);
        //   square.classList.remove("right");
        //   square.classList.add("front");
        // }
        let angle = window.getComputedStyle(square).rotate;
        if (angle != "none") {
          angle = parseInt(angle.match(/[-]?\d+/g).join(""));
        } else {
          angle = 0;
        }
        let newAngle = angle + deg;
        square.style.rotate = `${axe} ${newAngle}deg`;
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
function setMovePossible() {
  let allCube = document.querySelectorAll(".square");
  allCube.forEach(element => {
    let face = element.classList[2][0]    // L M R U E D F
    let row = element.classList[2][1]     // t m b
    let column = element.classList[2][2]  // l c r
    
    // select movable squares for each moves
    let Lmove = face == 'L' | ((face == 'F' | face == 'U' | face == 'D') & column == 'l') | (face == 'B' & column == 'r')
    let Mmove = (face == 'F' | face == 'D' | face == 'B' | face == 'U') & column == 'c'
    let Rmove = face == 'R' | ((face == 'F' | face == 'U' | face == 'D') & column == 'r') | (face == 'B' & column == 'l')
    
    let Umove = face == 'U' | ((face == 'F' | face == 'L' | face == 'B' | face == 'R') & row == 't')
    let Emove = (face == 'F' | face == 'R' | face == 'B' | face == 'L') & row == 'm'
    let Dmove = face == 'D' | ((face == 'F' | face == 'L' | face == 'B' | face == 'R') & row == 'b')

    let Fmove = face == 'F' | (face == 'D' & row == 't') | (face == 'L' & column == 'r') | (face == 'U' & row == 'b') | (face == 'R' & column == 'l')
    
    // set doable movement
    if (Lmove) {
      element.classList.add('L')
    }
    if (Mmove) {
      element.classList.add('M')
    }
    if (Rmove) {
      element.classList.add('R')
    }
    if (Umove) {
      element.classList.add('U')
    }
    if (Emove) {
      element.classList.add('E')
    }
    if (Dmove) {
      element.classList.add('D')
    }
    if (Fmove) {
      element.classList.add('F')
    }
    
  });
  
}