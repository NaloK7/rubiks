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
    const magnitudeProduct =
      this.vectorMagnitude(vector1) * this.vectorMagnitude(vector2);
    return dotProduct / magnitudeProduct;
  }

  /**
   * Analyzes the directional relationship between two vectors by calculating
   * the cosine of the angle between them.
   *
   * @param {Object} mouseVector - The vector representing the mouse movement,
   *   with properties `start` and `end` containing `x` and `y` coordinates.
   * @param {Object} faceVector - The vector representing the face direction,
   *   with properties `start` and `end` containing `x` and `y` coordinates.
   * @returns {number} The cosine of the angle between the two vectors.
   */
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

  createVector(startX, startY, endX, endY) {
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
    };
  }
}
