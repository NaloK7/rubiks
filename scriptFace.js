let rotateX = -25;
let rotateY = 45;

let lastMouseX = 0;
let lastMouseY = 0;

// Gestion des événements pour la souris
document.addEventListener("mousedown", function(ev) {
	lastMouseX = ev.clientX;
	lastMouseY = ev.clientY;
	document.addEventListener("mousemove", mouseMoved);
});

document.addEventListener("mouseup", function() {
	document.removeEventListener("mousemove", mouseMoved);
});

// Gestion des événements pour le toucher
document.addEventListener("touchstart", function(ev) {
	// Empêche le comportement par défaut (ex: scroll)
	ev.preventDefault();
	// Utilise le premier doigt touché (ev.touches[0])
	lastMouseX = ev.touches[0].clientX;
	lastMouseY = ev.touches[0].clientY;
	document.addEventListener("touchmove", touchMoved);
});

document.addEventListener("touchend", function() {
	document.removeEventListener("touchmove", touchMoved);
});

// Fonction pour gérer les mouvements de la souris
function mouseMoved(ev) {
	var deltaX = ev.pageX - lastMouseX;
	var deltaY = ev.pageY - lastMouseY;

	lastMouseX = ev.pageX;
	lastMouseY = ev.pageY;

	rotateX += deltaY * -0.5;
	rotateY -= deltaX * -0.5;

	rotateCube();
}

// Fonction pour gérer les mouvements tactiles
function touchMoved(ev) {
	var deltaX = ev.touches[0].clientX - lastMouseX;
	var deltaY = ev.touches[0].clientY - lastMouseY;

	lastMouseX = ev.touches[0].clientX;
	lastMouseY = ev.touches[0].clientY;

	rotateX += deltaY * -0.5;
	rotateY -= deltaX * -0.5;

	rotateCube();
}

// Fonction pour mettre à jour la transformation du cube
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
