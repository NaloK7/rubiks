var lastMouseX = 0,
	lastMouseY = 0;
var rotX = 0,
	rotY = 0;

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

	rotY -= deltaX * -0.1;
	rotX += deltaY * -0.1;

	updateCubeTransform();
}

// Fonction pour gérer les mouvements tactiles
function touchMoved(ev) {
	var deltaX = ev.touches[0].clientX - lastMouseX;
	var deltaY = ev.touches[0].clientY - lastMouseY;

	lastMouseX = ev.touches[0].clientX;
	lastMouseY = ev.touches[0].clientY;

	rotY -= deltaX * -0.1;
	rotX += deltaY * -0.1;

	updateCubeTransform();
}

// Fonction pour mettre à jour la transformation du cube
function updateCubeTransform() {
	var cube = document.getElementById("cube");
	cube.style.transformOrigin = "50% 50%";
	cube.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
}
