import { myCube } from "../main.js";

export class CubeEventHandler {
  constructor() {
    this.startPointer = null;
    this.currentPointer = null;
    this.selectedSquare = null;
    this.swiper = null;
    this.swiperWidth = 0;
    // this.selectedText = this.selectText.bind(this);
    // this.letterIndex = 0;
    // this.target = null;

    this.currentMemo = null; // Variable to store the currently selected memo element
    this.currentTxt = null; // Variable to store the text of the currently selected memo
    this.index = -1;
    this.mouseDownOnMemo = this.mouseDownOnMemo.bind(this);

    this.scrollOffset = 0;
    this.clickedTag = null;

    this.THRESHOLD = 60;
    this.touchFlag = false;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  initializeEventListeners() {
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("touchstart", this.onTouchStart);
    document.addEventListener("touchend", this.onTouchEnd);
    let memoList = document.querySelectorAll(".memo"); // Select all elements with class 'memo'
  memoList.forEach((memo) => {
    // Iterate over each memo element
    memo.addEventListener("mousedown", this.mouseDownOnMemo); // Add mousedown event listener to each memo to call mouseDownOnMemo
  });
  }
  mouseDownOnMemo() {
    // if the currentTxt is different from the clicked memo's text
    if (this.currentTxt != event.target.children[1].innerText) {
      // Reset the previous memo's text to its original state
      if (this.currentMemo != null) {
        this.currentMemo.children[1].innerHTML = currentTxt;
      }
      this.currentTxt = event.target.children[1].innerText; // Update currentTxt with the clicked memo's text
      this.currentMemo = event.target; // Update currentMemo with the clicked memo element
      this.index = -1;
      this.selectText(); // Call moveSimulation to process the text
    }
  }
  resetMovement() {
    this.selectedSquare = null;
    this.startPointer = null;
    this.currentPointer = null;
    myCube.resetFaceVectors();
  }

  // CLICK

  onMouseDown(ev) {
    if (!myCube.isAnimate) {
      this.startPointer = { x: ev.clientX, y: ev.clientY };
      this.currentPointer = { x: ev.clientX, y: ev.clientY };

      this.getElementClicked(ev);

      if (this.clickedTag === "square") {
        this.selectedSquare = this.getSelectedSquare(ev);
        myCube.setFaceVectors(this.selectedSquare);
      } else if (this.clickedTag === "memo") {
        this.swiper = this.getSwipper(ev);
        // get the width of all memo in the clicked swiper
        let childrenList = this.swiper.children;
        this.swiperWidth = 0;
        for (let i = 0; i < childrenList.length; i++) {
          const child = childrenList[i];
          this.swiperWidth += child.offsetWidth;
        }
      }

      document.addEventListener("mousemove", this.onPointerMove);
    }
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
      myCube.setFaceVectors(this.selectedSquare);
    } else if (this.clickedTag === "memo") {
      this.swiper = this.getSwipper(ev);
      // get the width of all memo in the clicked swiper
      let childrenList = this.swiper.children;
      this.swiperWidth = 0;
      for (let i = 0; i < childrenList.length; i++) {
        const child = childrenList[i];
        this.swiperWidth += child.offsetWidth;
      }
    }
    let cubeContainer = document.querySelector("#cubeContainer");
    cubeContainer.addEventListener("touchmove", (ev) => ev.preventDefault(), {
      passive: false,
    });
    document.addEventListener("touchmove", this.onPointerMove.bind(this));
  }

  onTouchEnd() {
    this.selectedSquare = null;
    document.removeEventListener("touchmove", this.onPointerMove.bind(this));
  }

  // SELECT ELEMENT

  getElementClicked(ev) {
    if (ev.target.id === "cubeContainer") {
      this.clickedTag = "cube";
    } else if (
      ev.target.tagName === "SPAN" ||
      ev.target.classList.contains("square")
    ) {
      this.clickedTag = "square";
    } else if (
      ev.target.classList.contains("memo") ||
      ev.target.classList.contains("swiper")
    ) {
      this.clickedTag = "memo";
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

  getSwipper(ev) {
    let swiperClicked = null;
    if (
      ev.target.classList.contains("memo") &&
      ev.target.parentNode.classList.contains("swiper")
    ) {
      swiperClicked = ev.target.parentNode;
    } else if (ev.target.classList.contains("swiper")) {
      swiperClicked = ev.target;
    }
    return swiperClicked;
  }
  // CUBE EVENT

  onPointerMove(ev) {
    if (ev.type === "mousemove" && this.currentPointer != null) {
      this.currentPointer.x = ev.clientX;
      this.currentPointer.y = ev.clientY;
    } else if (ev.type === "touchmove" && this.currentPointer != null) {
      this.currentPointer.x = ev.touches[0].clientX;
      this.currentPointer.y = ev.touches[0].clientY;
    }

    if (this.clickedTag === "square") {
      this.handleRotationGroup();
    } else if (this.clickedTag === "cube") {
      this.handleCubeMovement();
    } else if (this.clickedTag === "memo") {
      this.handleScrollImage();
    }
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

    if (myCube.vectorLength(mouseVector) > this.THRESHOLD) {
      let moveDirection = "";
      const horizontal = myCube.analyzeVectors(
        mouseVector,
        myCube.faceHorizontalVector
      );
      const vertical = myCube.analyzeVectors(
        mouseVector,
        myCube.faceVerticalVector
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
          myCube.rotateGroup(this.selectedSquare.classList[3], !reverse);
          break;
        case "-h":
          reverse = face === "D";
          myCube.rotateGroup(this.selectedSquare.classList[3], reverse);
          break;
        case "v":
          reverse = face === "R" || face === "B";
          myCube.rotateGroup(this.selectedSquare.classList[2], reverse);
          break;
        case "-v":
          reverse = face === "R" || face === "B";
          myCube.rotateGroup(this.selectedSquare.classList[2], !reverse);
          break;
      }
      if (this.currentTxt != null) {
        this.selectText()
      }
      this.onMouseUp();
    }
  }

  // MEMO EVENT

  handleScrollImage() {
    this.scrollOffset = parseInt(this.swiper.style.left || 0, 10);
    if (this.currentPointer != null) {
      let deltaX = this.currentPointer.x - this.startPointer.x;
      this.scrollOffset += deltaX;
      // todo: improve min and max scroll
      if (
        this.scrollOffset < 108 &&
        this.scrollOffset >= -1 * this.swiperWidth + 150
      ) {
        this.swiper.style.left = `${this.scrollOffset}px`;
        this.startPointer.x += deltaX;
      }
    }
  }

  selectText() {
    if (this.currentTxt) {
      // Check if there is a current text
      this.index++;
      let newTxt = this.currentTxt.match(/([a-zA-Z]')|[a-zA-Z]/g) || [];
      if (this.index >= newTxt.length) {
        // Check if the index is out of bounds
        // todo: reset the text in the memo
        this.currentMemo.children[1].innerHTML = this.currentTxt;
        this.currentTxt = null; // Reset currentTxt if out of bounds
        this.index = -1;
      } else {
        newTxt[this.index] = `<span class="currentLetter">${newTxt[this.index]}</span>`;
        this.currentMemo.children[1].innerHTML = newTxt.join(""); // Update the memo's inner HTML with the new text
      }
    }
  }
}
