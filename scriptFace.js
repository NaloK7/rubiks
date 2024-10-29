let rotateX = -25;
let rotateY = 45;

let lastMouseX = 0;
let lastMouseY = 0;

// MOUSE EVENT
document.addEventListener("mousedown", function(ev) {
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
    document.addEventListener("mousemove", pointerMoved);
});

document.addEventListener("mouseup", function() {
	document.removeEventListener("mousemove", pointerMoved);
});

// TOUCH EVENT
document.addEventListener("touchstart", function(ev) {
    lastMouseX = ev.touches[0].clientX;
	lastMouseY = ev.touches[0].clientY;
	document.addEventListener("touchmove", (ev) => ev.preventDefault(), { passive: false });

    document.addEventListener("touchmove", pointerMoved);
});

document.addEventListener("touchend", function() {
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

    lastMouseX = clientX;
    lastMouseY = clientY;

    rotateX += deltaY * -0.5;
    rotateY -= deltaX * -0.5;

    rotateCube();
}

// ROTATE CUBE
function rotateCube() {
	var cube = document.querySelector(".cube");
	// cube.style.transformOrigin = "50% 50%";
	cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function rotY() {
  rotateY += 90;

  let newTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  let cube = document.querySelector(".cube");

  cube.style.transform = newTransform;

    // todo remove when unused
  // document.querySelector("#transformValue").textContent =
  //   "Transform: " + newTransform;
}

// RESET ROTATION
function resetRotation() {
  let cube = document.querySelector(".cube");
  cube.classList.add("reset-animation"); // Ajoute la classe pour l'animation

  setTimeout(() => {
    rotateX = -25;
    rotateY = 45;
    let newTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    cube.style.transform = newTransform;

    cube.classList.remove("reset-animation");
  }, 500);
  cube.style.transform = newTransform;
}

// get id of clicked element
document.addEventListener("click", (event) => {
  let elementId = event.target.id;
  if (!elementId) {
    let parentElementWithId = event.target.closest("[id]");
    if (parentElementWithId) {
      elementId = parentElementWithId.id;
    }
  }
  document.querySelector("#clickedId").textContent = elementId;
});
