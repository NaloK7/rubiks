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
    L(90);
    document.removeEventListener("mousemove", mouseMove);
} else if (mouseX <= -50) {
	L(-90);
	document.removeEventListener("mousemove", mouseMove);
  }
}
function L(deg) {
  let cube = document.querySelector(".cube");
  cube.style.transform += `rotateZ(${deg}deg)`;
}
