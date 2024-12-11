import { myCube, cubeEvent } from "../main.js";

  
  export class VectorUtils {
    getVectorDirection(vector) {
      return {
        x: vector.end.x - vector.start.x,
        y: vector.end.y - vector.start.y,
      };
    }
  
    vectorMagnitude(vector) {
      return Math.sqrt(vector.x ** 2 + vector.y ** 2);
    }
  
    getCosAngle(vector1, vector2) {
      const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
      const magnitudeProduct = this.vectorMagnitude(vector1) * this.vectorMagnitude(vector2);
      return dotProduct / magnitudeProduct;
    }
  
    analyzeVectors(mouseVector, faceVector) {
      const mouseDir = this.getVectorDirection(mouseVector);
      const faceDir = this.getVectorDirection(faceVector);
  
      const cosAngle = this.getCosAngle(mouseDir, faceDir);
      return cosAngle;
    }
  
    vectorLength(vector) {
      let dx = vector.end.x - vector.start.x;
      let dy = vector.end.y - vector.start.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    getFaceVectors(square) {
      const faceLetter = square.classList[1][0];
      const faceIndex = this.getFaceIndex(faceLetter);
  
      if (faceIndex !== -1) {
        cubeEvent.setFaceHorizontalVector(
          this.getPoint(faceIndex, 1, 0).x,
          this.getPoint(faceIndex, 1, 0).y,
          this.getPoint(faceIndex, 1, 2).x,
          this.getPoint(faceIndex, 1, 2).y
        );
        cubeEvent.setFaceVerticalVector(
          this.getPoint(faceIndex, 0, 1).x,
          this.getPoint(faceIndex, 0, 1).y,
          this.getPoint(faceIndex, 2, 1).x,
          this.getPoint(faceIndex, 2, 1).y
        );
      }
    }
  
    getPoint(faceIndex, row, col) {
      const select = myCube.cube[faceIndex][row][col].split(" ")[0]; // ex: Ftl
      const square = document.querySelector(`.${select}`);
      const squareRect = square.getBoundingClientRect();
      let x = squareRect.left + squareRect.width / 2;
      let y = squareRect.top + squareRect.height / 2;
      return { x, y };
    }
  
    getFaceIndex(faceLetter) {
      const faceMap = {
        F: 0, // Front face
        L: 1, // Left face
        B: 2, // Back face
        R: 3, // Right face
        U: 4, // Up face
        D: 5, // Down face
      };
      return faceMap[faceLetter] ?? -1;
    }
  }
