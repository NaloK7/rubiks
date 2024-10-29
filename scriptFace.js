let rotateX = -25;
let rotateY = 45;
let rotateZ = 0;

let translateX = 150;
let translateY = 150;
let translateZ = 150;

function rotY() {
  rotateY += 90;

  let newTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;

  let cube = document.querySelector("#cube");

  cube.style.transformOrigin = "50% 50%";
  cube.style.transform = newTransform;

  document.querySelector("#transformValue").textContent =
    "Transform: " + newTransform;
}

// get id of clicked element
document.addEventListener("click", (event) => {
  let cubeId = event.target.id;
  document.querySelector("#clickedId").textContent = cubeId;
});
