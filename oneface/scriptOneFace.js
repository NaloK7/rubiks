
window.addEventListener("DOMContentLoaded", function() {
  let allCube = document.querySelectorAll(".square");
  allCube.forEach(cube => {
    cube.style.transition = "transform ease 1s";
    
  });
}, false);

let lastMouseX;
let lastMouseY;
let rotX;
let rotY;

document.addEventListener("mousedown", (ev) => {
  lastMouseX = ev.clientX;
  lastMouseY = ev.clientY;
  document.addEventListener("mousemove", mouseMove);
});

document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", mouseMove);
});

function mouseMove(ev) {
  let mouseX = ev.pageX - lastMouseX;
  let mouseY = ev.pageY - lastMouseY;
  if (mouseX >= 50) {
    // L(90);
    U(90);
    document.removeEventListener("mousemove", mouseMove);
  } else if (mouseX <= -50) {
    // L(-90);
    U(-90);
    document.removeEventListener("mousemove", mouseMove);
  }
}

let initialRotation = 0;
/**
 * rotate on Y axis
 *
 * @param {int} deg
 */
// todo remove initialRotation after switch class in place
function U(deg) {
  // get list of all element that need to move
  let front = document.querySelectorAll(".F.t");
  let left = document.querySelectorAll(".L.t");
  let back = document.querySelectorAll(".B.t");
  let right = document.querySelectorAll(".R.t");
  let faces = [];
  faces.push(front);
  faces.push(left);
  faces.push(back);
  faces.push(right);
  console.log("🚀 ~ U ~ faces:", faces);

  // for each face
  for (let i = 0; i < faces.length; i++) {
    // temporarely save the first face nodeList
    let temp = faces[0];
    const row = faces[i];

    // for each row of that face
    for (let j = 0; j < row.length; j++) {
      const cube = row[j];
      
      // apply transform origin for specific movement
      if (cube.classList.contains("l")) {
        cube.style.transformOrigin = "150% 150% -150px";
      } else if (cube.classList.contains("c")) {
        cube.style.transformOrigin = "50% 150% -150px";
      } else if (cube.classList.contains("r")) {
        cube.style.transformOrigin = "-50% 150% -150px";
      }
      console.log("🚀 ~ U ~ faces[i+1][j]:", faces[i+1][j])
      // const matrix = window.getComputedStyle(cube).transform;
      if (i+1 > faces.length) {
        cube.style.tranform = window.getComputedStyle(temp[j]).transform
        
      } else {
        cube.style.tranform = window.getComputedStyle(faces[i+1][j]).transform

      }
      // const color = window.getComputedStyle(cube).backgroundColor;
    }


    // element.style.transform = ;
  }
}

function test() {
  let ftl = document.querySelector(".F.t.l");
  let ftr = document.querySelector(".F.t.r");
  let fbr = document.querySelector(".F.b.r");
  
  ftr.classList.remove("t");
  ftr.classList.add("b");
}

/**
 * Extracts the 3D translation values from the CSS transform property of a given element.
*
* @param {HTMLElement} element - The DOM element from which to retrieve the transform values.
* @returns {Object} An object containing the translation values along the x, y, and z axes.
*                   If no 3D transformation is detected, returns default values of zero.
*/
function getTranslate3dValues(element) {
  // Get the computed style of the element
  const transformList = window.getComputedStyle(element).transform;
  const color = window.getComputedStyle(element).backgroundColor;

  if (transformList.startsWith("matrix3d")) {
    const values = transformList.slice(9, -1).split(", ").map(parseFloat);

    const translateX = values[12];
    const translateY = values[13];
    const translateZ = values[14];
    // console.log("Translation:", translateX, translateY, translateZ);

    return {
      tx: translateX,
      ty: translateY,
      tz: translateZ,
      color: color,
    };
  } else {
    console.log("Pas de transformation 3D détectée.");
  }

  // Default to zero if no transform is applied
  return { tx: 0, ty: 0, tz: 0 };
}
