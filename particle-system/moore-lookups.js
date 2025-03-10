export function calculateMoore3DTransformations() {
  const transformationX = new Int32Array(8);
  const transformationY = new Int32Array(8);
  const transformationZ = new Int32Array(8);

  // Define base transformations
  const rotateX90 = [1, 0, 0, 0, 0, -1, 0, 1, 0];
  const rotateY90 = [0, 0, 1, 0, 1, 0, -1, 0, 0];
  const rotateZ90 = [0, -1, 0, 1, 0, 0, 0, 0, 1];
  const reflectX = [1, 0, 0, 0, -1, 0, 0, 0, -1];
  const reflectY = [-1, 0, 0, 0, 1, 0, 0, 0, -1];
  const reflectZ = [-1, 0, 0, 0, -1, 0, 0, 0, 1];
  const translate100 = [1, 0, 0];
  const translate010 = [0, 1, 0];
  const translate001 = [0, 0, 1];

  // Function to perform matrix multiplication (3x3)
  function matrixMultiply(a, b) {
    const result = new Array(9);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i * 3 + j] = a[i * 3 + 0] * b[0 * 3 + j] + a[i * 3 + 1] * b[1 * 3 + j] + a[i * 3 + 2] * b[2 * 3 + j];
      }
    }
    return result;
  }

  // Calculate transformations for each direction
  for (let direction = 0; direction < 8; direction++) {
    let currentRotation = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    let currentTranslation = [0, 0, 0];

    // Apply transformations based on direction
    if (direction === 0) {
      // No transformation
    } else if (direction === 1) {
      currentRotation = matrixMultiply(currentRotation, rotateY90);
      currentTranslation = translate100;
    } else if (direction === 2) {
      currentRotation = matrixMultiply(currentRotation, rotateZ90);
      currentTranslation = translate001;
    } else if (direction === 3) {
      currentRotation = matrixMultiply(currentRotation, rotateX90);
      currentTranslation = translate010;
    } else if (direction === 4) {
      currentRotation = matrixMultiply(currentRotation, reflectX);
    } else if (direction === 5) {
      currentRotation = matrixMultiply(currentRotation, reflectY);
    } else if (direction === 6) {
      currentRotation = matrixMultiply(currentRotation, reflectZ);
    } else if (direction === 7) {
      currentRotation = matrixMultiply(matrixMultiply(currentRotation, rotateY90), rotateX90);
      currentTranslation = translate100;
    }

    // Store transformation values in the lookup tables
    transformationX[direction] = currentRotation[0] + currentRotation[4] + currentRotation[8] + currentTranslation[0];
    transformationY[direction] = currentRotation[1] + currentRotation[5] + currentRotation[6] + currentTranslation[1];
    transformationZ[direction] = currentRotation[2] + currentRotation[3] + currentRotation[7] + currentTranslation[2];
  }

  return { transformationX, transformationY, transformationZ };
}

export function generateMoore3DLookupTableString() {
  const transformationData = calculateMoore3DTransformations();
  let glslString = "const int transformationX[8] = int[8](";
  for (let i = 0; i < 8; i++) {
    glslString += transformationData.transformationX[i];
    if (i < 7) glslString += ", ";
  }
  glslString += ");\n";

  glslString += "const int transformationY[8] = int[8](";
  for (let i = 0; i < 8; i++) {
    glslString += transformationData.transformationY[i];
    if (i < 7) glslString += ", ";
  }
  glslString += ");\n";

  glslString += "const int transformationZ[8] = int[8](";
  for (let i = 0; i < 8; i++) {
    glslString += transformationData.transformationZ[i];
    if (i < 7) glslString += ", ";
  }
  glslString += ");\n";

  return glslString;
}
