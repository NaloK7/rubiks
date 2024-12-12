import { VectorUtils } from "./VectorUtils.js";
import { myCube } from "../main.js";

const vector = new VectorUtils();
export class CubeEventHandler {
  constructor() {
    this.startPointer = null;
    this.currentPointer = null;
    this.selectedSquare = null;
    this.faceHorizontalVector = null;
    this.faceVerticalVector = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  setFaceHorizontalVector(startX, startY, endX, endY) {
    this.faceHorizontalVector = {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
    };
  }

  setFaceVerticalVector(startX, startY, endX, endY) {
    this.faceVerticalVector = {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
    };
  }

  initializeEventListeners() {
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("touchstart", this.onTouchStart);
    document.addEventListener("touchend", this.onTouchEnd);
  }

  resetMovement() {
    this.selectedSquare = null;
    this.startPointer = null;
    this.currentPointer = null;
    this.faceHorizontalVector = null;
    this.faceVerticalVector = null;
  }

  onMouseDown(ev) {
    this.startPointer = { x: ev.clientX, y: ev.clientY };
    this.currentPointer = { x: ev.clientX, y: ev.clientY };
    this.selectedSquare = this.getSelectedSquare(ev);

    if (this.selectedSquare) {
      vector.getFaceVectors(this.selectedSquare);
    }
    document.addEventListener("mousemove", this.onPointerMove);
  }

  onMouseUp() {
    this.resetMovement();
    document.removeEventListener("mousemove", this.onPointerMove);
  }

  onTouchStart(ev) {
    this.startPointer = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    this.currentPointer = {
      x: ev.touches[0].clientX,
      y: ev.touches[0].clientY,
    };
    this.selectedSquare = this.getSelectedSquare(ev);

    if (this.selectedSquare) {
      vector.getFaceVectors(this.selectedSquare);
    }

    document.addEventListener("touchmove", (ev) => ev.preventDefault(), {
      passive: false,
    });
    document.addEventListener("touchmove", this.onPointerMove.bind(this));
  }

  onTouchEnd() {
    this.selectedSquare = null;
    document.removeEventListener("touchmove", this.onPointerMove.bind(this));
  }

  getSelectedSquare(ev) {
    const squareClicked =
      ev.target.tagName === "SPAN" &&
      ev.target.parentNode.classList.contains("square");
    return squareClicked ? ev.target.parentNode : null;
  }

  onPointerMove(ev) {
    if (ev.type === "mousemove") {
      this.currentPointer.x = ev.clientX;
      this.currentPointer.y = ev.clientY;
    } else if (ev.type === "touchmove") {
      this.currentPointer.x = ev.touches[0].clientX;
      this.currentPointer.y = ev.touches[0].clientY;
    }

    if (this.selectedSquare) {
      this.handleRotationGroup();
    } else {
      this.handleCubeMovement();
    }
  }

  handleCubeMovement() {
    const deltaX = this.currentPointer.x - this.startPointer.x;
    const deltaY = this.currentPointer.y - this.startPointer.y;

    if (myCube.rotateX % 360 > 135 && myCube.rotateX % 360 <= 225) {
      myCube.updateRotateX(deltaY * -0.5);
      myCube.updateRotateY(deltaX * 0.5);

    } else {
      myCube.updateRotateX(deltaY * -0.5);
      myCube.updateRotateY(deltaX * -0.5);
    }

    this.startPointer.x += deltaX;
    this.startPointer.y += deltaY;

    myCube.applyCubeRotation();
  }

  // other approach !!! gimbal lock: sometimes mix X and Z axis !!!

  // handleCubeMovement() {
  //   const deltaX = this.currentPointer.x - this.startPointer.x;
  //   const deltaY = this.currentPointer.y - this.startPointer.y;

    
  //   if (myCube.rotateX % 360 > 45 && myCube.rotateX % 360 <= 135) {
  //     myCube.updateRotateX(deltaY * -0.5);
  //     myCube.updateRotateZ(deltaX * 0.5);

  //   } else if (myCube.rotateX % 360 > 135 && myCube.rotateX % 360 <= 225) {
  //     myCube.updateRotateX(deltaY * -0.5);
  //     myCube.updateRotateY(deltaX * 0.5);

  //   } else if (myCube.rotateX % 360 > 225 && myCube.rotateX % 360 <= 315) {
  //     myCube.updateRotateX(deltaY * -0.5);
  //     myCube.updateRotateZ(deltaX * -0.5);

  //   } else {
  //     myCube.updateRotateX(deltaY * -0.5);
  //     myCube.updateRotateY(deltaX * -0.5);
  //   }

  //   this.startPointer.x += deltaX;
  //   this.startPointer.y += deltaY;

  //   myCube.applyCubeRotation();
  // }

  handleRotationGroup() {
    const mouseVector = {
      start: { x: this.startPointer.x, y: this.startPointer.y },
      end: { x: this.currentPointer.x, y: this.currentPointer.y },
    };

    if (vector.vectorLength(mouseVector) > myCube.THRESHOLD) {
      let moveDirection = "";
      const horizontal = vector.analyzeVectors(
        mouseVector,
        this.faceHorizontalVector
      );
      const vertical = vector.analyzeVectors(
        mouseVector,
        this.faceVerticalVector
      );

      if (Math.abs(vertical) > Math.abs(horizontal)) {
        moveDirection = vertical < 0 ? "-v" : "v";
      } else {
        moveDirection = horizontal < 0 ? "-h" : "h";
      }

      const face = this.selectedSquare.classList[1][0];
      let reverse = false;

      switch (moveDirection) {
        case "h":
          reverse = face === "D";
          myCube.rotateGroupe(this.selectedSquare.classList[3], !reverse);
          break;
        case "-h":
          reverse = face === "D";
          myCube.rotateGroupe(this.selectedSquare.classList[3], reverse);
          break;
        case "v":
          reverse = face === "R" || face === "B";
          myCube.rotateGroupe(this.selectedSquare.classList[2], reverse);
          break;
        case "-v":
          reverse = face === "R" || face === "B";
          myCube.rotateGroupe(this.selectedSquare.classList[2], !reverse);
          break;
      }
      this.onMouseUp();
    }
  }
}
