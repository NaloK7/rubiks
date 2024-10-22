var lastMouseX = 0,
	lastMouseY = 0;
var rotX = 0,
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
	var deltaX = ev.pageX - lastMouseX;
	var deltaY = ev.pageY - lastMouseY;

	lastMouseX = ev.pageX;
	lastMouseY = ev.pageY;

	rotY -= deltaX * -0.1;
	rotX += deltaY * -0.1;

	document.getElementById("cube").style.transform = `translateZ(-100px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}
