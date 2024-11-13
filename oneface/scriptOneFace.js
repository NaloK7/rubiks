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
  let toRotate = document.querySelectorAll(".F.t, .R.t");
  
  initialRotation += deg;
  toRotate.forEach((element) => {
    if (element.classList.contains("l")) {
      console.log("🚀 ~ toRotate.forEach ~ element:", element)
      
      element.style.transformOrigin = "150% 150% -150px";
    } else if (element.classList.contains("c")) {
      element.style.transformOrigin = "50% 150% -150px";
    } else if (element.classList.contains("r")) {
      element.style.transformOrigin = "-50% 150% -150px";
    }

    translateValues = getTranslate3dValues(element);
    console.log(translateValues.color);
    
    element.style.transition = 'transform ease 1s'
    element.style.transform = `translate3d(${translateValues.tx}px, ${translateValues.ty}px, ${translateValues.tz}px) rotateY(${initialRotation}deg)`;
  });
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
  console.log("🚀 ~ getTranslate3dValues ~ transformList:", transformList)
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
      color: color
    };
  } else {
    console.log("Pas de transformation 3D détectée.");
  }

  // Default to zero if no transform is applied
  return { tx: 0, ty: 0, tz: 0};
}
