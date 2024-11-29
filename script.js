
// let rotateX = -20;
// let rotateY = -20;

// let lastMouseX = 0;
// let lastMouseY = 0;

// // MOUSE EVENT
// document.addEventListener("mousedown", function (ev) {
//   lastMouseX = ev.clientX;
//   lastMouseY = ev.clientY; 
//   let squareClicked = ev.target.tagName == "SPAN" & ev.target.parentNode.classList[0] == "square"
//   // click on square
//   if (squareClicked) {
//     // todo
//     console.log("🚀 ~ squareClicked:", squareClicked)
//   } else {
//     // rotate the cube
//     document.addEventListener("mousemove", pointerMoved);
//   }
  
// });

// document.addEventListener("mouseup", function () {
//   document.removeEventListener("mousemove", pointerMoved);
// });

// // TOUCH EVENT
// document.addEventListener("touchstart", function (ev) {
//   lastMouseX = ev.touches[0].clientX;
//   lastMouseY = ev.touches[0].clientY;

//   let squareClicked = ev.target.tagName == "SPAN" & ev.target.parentNode.classList[0] == "square"
//   // click on square
//   if (squareClicked) {
//     // todo
//     console.log("🚀 ~ squareClicked:", squareClicked)
//   } else {
// // rotate the cube
//     document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
//       passive: false,
//     });

//     document.addEventListener("touchmove", pointerMoved);
//   }
// });

// document.addEventListener("touchend", function () {
//   document.removeEventListener("touchmove", pointerMoved);
// });

// // POINTER MOVE
// function pointerMoved(ev) {
//   console.log(ev);
  
//   let clientX, clientY;

//   if (ev.type === "mousemove") {
//     clientX = ev.clientX;
//     clientY = ev.clientY;
//   } else if (ev.type === "touchmove") {
//     clientX = ev.touches[0].clientX;
//     clientY = ev.touches[0].clientY;
//   }

//   let deltaX = clientX - lastMouseX;
//   let deltaY = clientY - lastMouseY;

//   lastMouseX = clientX;
//   lastMouseY = clientY;

//   rotateX += deltaY * -0.5;
//   rotateY -= deltaX * -0.5;

//   rotateCube();
  
  
// }

// // ROTATE CUBE
// function rotateCube() {
//   let cube = document.querySelector(".cube");
//   cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

//   // watch cube rotation to set relative face
//   // let cubeTransform = document.querySelector('#cubeTransform')
//   // cubeTransform.innerHTML = window.getComputedStyle(cube).transform
// }

