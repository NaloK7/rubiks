import { cube } from "/cube.js";
import {
  setfaceHorizontalVector,
  setfaceVerticalVector,
} from "./event.js";
// VECTOR

export function getVectorDirection(vector) {
  return {
    x: vector.end.x - vector.start.x,
    y: vector.end.y - vector.start.y,
  };
}

function vectorMagnitude(vector) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function getCosAngle(vector1, vector2) {
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  const magnitudeProduct = vectorMagnitude(vector1) * vectorMagnitude(vector2);
  return dotProduct / magnitudeProduct;
}

export function analyzeVectors(mouseVector, faceVector) {
  const mouseDir = getVectorDirection(mouseVector);
  const faceDir = getVectorDirection(faceVector);

  const cosAngle = getCosAngle(mouseDir, faceDir);
  return cosAngle;
}

// old vector manipulation

export function vectorLength(vector) {
  let dx = vector.end.x - vector.start.x;
  let dy = vector.end.y - vector.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getFaceVectors(square) {
  const faceLetter = square.classList[1][0];
  const faceIndex = getFaceIndex(faceLetter);

  if (faceIndex !== -1) {
    setfaceHorizontalVector(
      getPoint(faceIndex, 1, 0).x,
      getPoint(faceIndex, 1, 0).y,
      getPoint(faceIndex, 1, 2).x,
      getPoint(faceIndex, 1, 2).y
    );
    //   faceHorizontalVector = {
    //     start: { x: getPoint(faceIndex, 1, 0).x, y: getPoint(faceIndex, 1, 0).y },
    //     end: { x: getPoint(faceIndex, 1, 2).x, y: getPoint(faceIndex, 1, 2).y },
    //   };
    setfaceVerticalVector(
      getPoint(faceIndex, 0, 1).x,
      getPoint(faceIndex, 0, 1).y,
      getPoint(faceIndex, 2, 1).x,
      getPoint(faceIndex, 2, 1).y
    );
    //   faceVerticalVector = {
    //     start: { x: getPoint(faceIndex, 0, 1).x, y: getPoint(faceIndex, 0, 1).y },
    //     end: { x: getPoint(faceIndex, 2, 1).x, y: getPoint(faceIndex, 2, 1).y },
    //   };
  }
}

function getPoint(faceIndex, row, col) {
  const select = cube[faceIndex][row][col].split(" ")[0]; // ex: Ftl
  const square = document.querySelector(`.${select}`);
  const squareRect = square.getBoundingClientRect();
  let x = squareRect.left + squareRect.width / 2;
  let y = squareRect.top + squareRect.height / 2;
  return { x, y };
}

function getFaceIndex(faceLetter) {
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
