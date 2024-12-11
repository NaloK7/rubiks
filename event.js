import { rotateX, updateRotateX, updateRotateY, rotateY, applyCubeRotation, rotateGroupe,THRESHOLD } from '/cube.js';
import { getFaceVectors, vectorLength, analyzeVectors } from '/vector.js';
// pointer coordinates
let startPointer = null;
let currentPointer = null;

// reference vector
export let faceHorizontalVector = null;
export let faceVerticalVector = null;



// global variable to track the selected square
let selectedSquare = null;
// MOUSE & TOUCH HANDLER

export function setfaceHorizontalVector(startX, startY, endX, endY) {
    faceHorizontalVector = {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
      };
}
export function setfaceVerticalVector(startX, startY, endX, endY) {
    faceVerticalVector = {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
      };
}
// Event listeners for mouse and touch events
export function initializeEventListeners() {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
}
  
function resetMouvement() {
    selectedSquare = null;
    startPointer = null;
    currentPointer = null;
    faceHorizontalVector = null;
    faceVerticalVector = null;
  }
  
  function onMouseDown(ev) {
    startPointer = { x: ev.clientX, y: ev.clientY };
    currentPointer = { x: ev.clientX, y: ev.clientY };
    selectedSquare = getSelectedSquare(ev);
  
    if (selectedSquare) {
      // set reference vectors
      getFaceVectors(selectedSquare);
    }
  
    document.addEventListener("mousemove", onPointerMove);
}
  
export function onMouseUp() {
    resetMouvement()
    document.removeEventListener("mousemove", onPointerMove);
  }
  
  function onTouchStart(ev) {
    startPointer = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    currentPointer = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    selectedSquare = getSelectedSquare(ev);
  
    if (selectedSquare) {
      getFaceVectors(selectedSquare);
    }
    document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
      passive: false,
    });
    document.addEventListener("touchmove", onPointerMove);
  }
  
  function onTouchEnd() {
    selectedSquare = null;
    document.removeEventListener("touchmove", onPointerMove);
  }
  
  function getSelectedSquare(ev) {
    const squareClicked =
      ev.target.tagName === "SPAN" &&
      ev.target.parentNode.classList.contains("square");
    return squareClicked ? ev.target.parentNode : null;
}
  
// POINTER MOVE

function onPointerMove(ev) {
    if (ev.type === "mousemove") {
      currentPointer.x = ev.clientX;
      currentPointer.y = ev.clientY;
    } else if (ev.type === "touchmove") {
      currentPointer.x = ev.touches[0].clientX;
      currentPointer.y = ev.touches[0].clientY;
    }
  
    if (selectedSquare) {
      handleRotationGroup();
    } else {
      handleCubeMovement();
    }
  }
  
  function handleCubeMovement() {
    const deltaX = currentPointer.x - startPointer.x;
    const deltaY = currentPointer.y - startPointer.y;
    updateRotateX(deltaY * -0.5);
    // rotateX += deltaY * -0.5;
      // rotateX = (rotateX + 360) % 360;
      updateRotateY(deltaX * -0.5);
    // rotateY += deltaX * 0.5;
    // rotateY = (rotateY + 360) % 360; 
    
    startPointer.x += deltaX;
    startPointer.y += deltaY;
    // if (rotateX < 315 & rotateX > 45) {
    //   // temp = rotateX
    //   applyCubeRotation(rotateX, rotateY, rotateX)
    // } else {
      
    //   applyCubeRotation(rotateX, rotateY);
    // }
    applyCubeRotation(rotateX, rotateY);
  }
  
  
  function handleRotationGroup() {
    const mouseVector = {
      start: { x: startPointer.x, y: startPointer.y },
      end: { x: currentPointer.x, y: currentPointer.y },
    };
  
    if (vectorLength(mouseVector) > THRESHOLD) {
      let moveDirection = "";
      const horizontal = analyzeVectors(mouseVector, faceHorizontalVector);
      const vertical = analyzeVectors(mouseVector, faceVerticalVector);
  
      if (Math.abs(vertical) > Math.abs(horizontal)) {
        moveDirection = vertical < 0 ? "-v" : "v";
      } else {
        moveDirection = horizontal < 0 ? "-h" : "h";
      }
  
      const face = selectedSquare.classList[1][0];
      let reverse = false;
  
      switch (moveDirection) {
        case "h":
          reverse = face === "D";
          rotateGroupe(selectedSquare.classList[3], !reverse);
          break;
        case "-h":
          reverse = face === "D";
          rotateGroupe(selectedSquare.classList[3], reverse);
          break;
        case "v":
          reverse = face === "R" || face === "B";
          rotateGroupe(selectedSquare.classList[2], reverse);
          break;
        case "-v":
          reverse = face === "R" || face === "B";
          rotateGroupe(selectedSquare.classList[2], !reverse);
          break;
      }
      onMouseUp();
    }
  }