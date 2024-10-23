let lastMouseX = 0,
	lastMouseY = 0;
let rotX = 0,
	rotY = 0;

document.addEventListener("mousedown", function(ev) {
	lastMouseX = ev.clientX;
	lastMouseY = ev.clientY;
	document.addEventListener("mousemove", mouseMoved);
});

document.addEventListener("mouseup", function() {
	document.removeEventListener("mousemove", mouseMoved);
});

function mouseMoved(ev) {
	let deltaX = ev.pageX - lastMouseX;
	let deltaY = ev.pageY - lastMouseY;

	lastMouseX = ev.pageX;
	lastMouseY = ev.pageY;

	rotY -= deltaX * -0.1;
	rotX += deltaY * -0.1;

    let face = document.querySelector(".face");
	// Apply the rotation transformation
	face.style.transform = `translateZ(-100px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function F() {
    let face = document.querySelector(".face");
    face.style.transform += `rotateZ(90deg)`
}
