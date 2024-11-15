window.onload = function () {
  const nav = document.querySelector("nav");

  // Récupère le chemin de base (pour GitHub Pages, inclut le nom du dépôt)
  const basePath = window.location.hostname.includes("github.io")
    ? "/rubiks"
    : ""; // Pas de préfixe en local

  nav.innerHTML = `
      <a href="${basePath}/index.html">home</a>
      <a href="${basePath}/simplecube/simpleCube.html">simple cube</a>
      <a href="${basePath}/oneface/oneFace.html">one face</a>
      <a href="${basePath}/cubeV1/cubeV1.html">cube V1</a>
      <a href="${basePath}/cubeV2/cubeV2.html">cube V2</a>
  `;
};

let rotateX = -20;
let rotateY = -20;

let lastMouseX = 0;
let lastMouseY = 0;

// MOUSE EVENT
document.addEventListener("mousedown", function (ev) {
  lastMouseX = ev.clientX;
  lastMouseY = ev.clientY;
  document.addEventListener("mousemove", pointerMoved);
});

document.addEventListener("mouseup", function () {
  document.removeEventListener("mousemove", pointerMoved);
});

// TOUCH EVENT
document.addEventListener("touchstart", function (ev) {
  lastMouseX = ev.touches[0].clientX;
  lastMouseY = ev.touches[0].clientY;
  document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
    passive: false,
  });

  document.addEventListener("touchmove", pointerMoved);
});

document.addEventListener("touchend", function () {
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