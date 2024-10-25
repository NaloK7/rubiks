let rotateY = 0;
let rotateX = 0;
let rotateZ = 0;
let translateZ = 0;

function rotY() {
  rotateY += 90;

  let newTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateZ(${translateZ}px)`;
  let cube = document.querySelector("#cube");

  cube.style.transformOrigin = "50% 50% 50%";
  cube.style.transform = newTransform;
  document.querySelector("#transformValue").textContent =
    "Transform: " + newTransform;
}

// get id of clicked element
document.addEventListener("click", (event) => {
  let cubeId = event.target.id;
  document.querySelector("#clickedId").textContent = cubeId;
});
