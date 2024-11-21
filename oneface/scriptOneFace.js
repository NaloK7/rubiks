window.addEventListener(
  "DOMContentLoaded",
   () => {
    displayMouseCoord();
    setInterval(displayCubeTransform, 100);

     let allCube = document.querySelectorAll(".square");
     let displayTag = document.querySelector('#tag')
     allCube.forEach((cube) => {
       cube.addEventListener('click', () => {
        let rect = cube.getBoundingClientRect();
        // console.log('Y:', rect.top.toFixed(2), '\nX:', rect.left.toFixed(2));
         
        let face = cube.classList[2]
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

function m_up(reverse = false) {
  if (!isAnimate) {
    isAnimate = true;
    let deg = -90;
    if (reverse) {
      deg = 90;
    }
    let row = document.querySelectorAll(".front, .left, .back, .right, .up");

    row.forEach((square) => {
      if (square.classList.contains("t") | square.classList.contains("up")) {
        let txt = square.innerHTML;
        if (square.classList.contains("right")) {
          square.innerHTML = txt.replace("right", "front");

          console.log(square.classList);
          square.classList.remove("right");
          square.classList.add("front");
        }
        let angle = window.getComputedStyle(square).rotate;
        if (angle != "none") {
          angle = parseInt(angle.match(/[-]?\d+/g).join(""));
        } else {
          angle = 0;
        }
        let newAngle = angle + deg;
        square.style.rotate = `y ${newAngle}deg`;
      }
    });
    setTimeout(() => {
      isAnimate = false;
    }, 500);
  }
}
