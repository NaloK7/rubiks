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
    this.scrollOffset = 0;
    this.clickedTag = null;

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

    this.getElementClicked(ev);

    if (this.clickedTag === "square") {
      this.selectedSquare = this.getSelectedSquare(ev);
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
    this.getElementClicked(ev);

    if (this.clickedTag === "square") {
      this.selectedSquare = this.getSelectedSquare(ev);
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

  getElementClicked(ev) {
    if (ev.target.id === "container") {
      this.clickedTag = "cube";
    } else if (
      ev.target.tagName === "SPAN" ||
      ev.target.classList.contains("square")
    ) {
      this.clickedTag = "square";
    } else if (ev.target.id === "helpSection") {
      this.clickedTag = "helpSection";
    } else {
      this.clickedTag = null;
    }
  }

  getSelectedSquare(ev) {
    let squareClicked = null;
    if (
      ev.target.tagName === "SPAN" &&
      ev.target.parentNode.classList.contains("square")
    ) {
      squareClicked = ev.target.parentNode;
    } else if (ev.target.classList.contains("square")) {
      squareClicked = ev.target;
    }
    return squareClicked;
  }

  onPointerMove(ev) {
    if (ev.type === "mousemove") {
      this.currentPointer.x = ev.clientX;
      this.currentPointer.y = ev.clientY;
    } else if (ev.type === "touchmove") {
      this.currentPointer.x = ev.touches[0].clientX;
      this.currentPointer.y = ev.touches[0].clientY;
    }

    if (this.clickedTag === "square") {
      this.handleRotationGroup();
    } else if (this.clickedTag === "cube") {
      this.handleCubeMovement();
    } else if (this.clickedTag === "helpSection") {
      this.handleScrollImage();
    }
  }

  handleScrollImage() {
    let image = document.querySelector("#helpSection");

    const deltaX = this.currentPointer.x - this.startPointer.x;
    this.scrollOffset += deltaX;
    image.style.backgroundPositionX = `${this.scrollOffset}px`;
    this.startPointer.x += deltaX;
  }

  // reminder: more complex approach may lead to gimbal lock (mix axis)
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

    this.startPointer.x = this.currentPointer.x;
    this.startPointer.y = this.currentPointer.y;

    myCube.applyCubeRotation();
  }

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
