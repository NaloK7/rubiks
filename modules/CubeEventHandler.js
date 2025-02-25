import { myCube } from "../main.js";

export class CubeEventHandler {
  constructor() {
    this.startPointer = null;
    this.currentPointer = null;
    this.selectedSquare = null;
    this.swiper = null;
    this.swiperWidth = 0;

    this.currentMemo = null;
    this.currentTxt = null;
    this.index = 0;
    this.skipflag = false;
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
    let memoList = document.querySelectorAll(".memo");
    memoList.forEach((memo) => {
      memo.addEventListener("mousedown", this.mouseDownOnMemo);
    });
  }
  mouseDownOnMemo() {
    if (this.currentTxt != event.target.children[1].innerText) {
      let memoList = document.querySelectorAll(".memo");
      memoList.forEach((memo) => {
        memo.classList.remove("current");
      });
      if (this.currentMemo != null) {
        this.currentMemo.style.border = "";
        this.currentMemo.children[1].innerHTML = this.currentTxt;
      }
      this.currentTxt = event.target.children[1].innerText;
      this.currentMemo = event.target;
      this.currentMemo.classList.add('current')
      this.index = 0;
      this.selectText();
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
      this.handleScrollMemo();
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
        this.selectText();
      }
      this.onMouseUp();
    }
  }

  // MEMO EVENT

  handleScrollMemo() {
    this.scrollOffset = parseInt(this.swiper.scrollLeft || 0, 10);
    console.log("🚀 ~ CubeEventHandler ~ handleScrollMemo ~ this.scrollOffset:", this.scrollOffset)

    if (this.currentPointer != null) {
      let deltaX = this.currentPointer.x - this.startPointer.x;
      this.scrollOffset += deltaX;
   
      // this.swiper.scrollLeft = this.scrollOffset;
      this.swiper.scrollLeft = deltaX;
    }
  }
  

  selectText() {
    if (this.currentTxt) {
      let currentTxtList = this.currentTxt.match(/([a-zA-Z]')|[a-zA-Z]/g) || [];
      if (this.index >= currentTxtList.length) {
        this.resetMemo();
      } else {
        // Get the current letter without
        let currentLetter = currentTxtList[this.index];

        // Highlight the current letter
        currentTxtList[
          this.index
        ] = `<span class="currentLetter">${currentLetter}</span>`;
        this.currentMemo.children[1].innerHTML = currentTxtList.join("");

        // Check if the letter is in lowercase
        if (this.skipflag || currentLetter.toLowerCase() !== currentLetter) {
          this.index++;
          this.skipflag = false;
        } else {
          this.skipflag = true;
        }
      }
    }
  }

  resetMemo() {
    this.currentMemo.children[1].innerHTML = this.currentTxt;
    this.currentTxt = null;
    this.currentMemo.classList.remove('current');
    this.currentMemo = null;
    this.index = 0;
    this.skipflag = false;
  }
}
