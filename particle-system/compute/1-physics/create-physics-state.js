// @ts-check

import { createAndCompileShader } from '../../gl-utils/create-and-compile-shader.js';
import { getUniformLocationVerified } from '../../gl-utils/get-uniform-location.js';
import { glErrorProgramLinkingString, glErrorString } from '../../gl-utils/gl-errors.js';
import { linkValidateProgram } from '../../gl-utils/link-validate-program.js';
import { gl_physics } from './glsl-physics.js';

/**
 * @param {WebGL2RenderingContext} gl
 * @returns {import('.').GLPhysicsState}
 */
export function createPhysicsState(gl) {
  const vertexShader = createAndCompileShader(gl, gl.VERTEX_SHADER, gl_physics);

  const fragmentShader = createAndCompileShader(gl, gl.FRAGMENT_SHADER, `
        #version 300 es
        void main() {}`);

  const program = gl.createProgram();
  if (!program) throw new Error('Program creation failed ' + glErrorString(gl));

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Transform Feedback Varyings
  gl.transformFeedbackVaryings(program, ['v_position', 'v_velocity'], gl.INTERLEAVED_ATTRIBS);

  linkValidateProgram(gl, program);

  const transformFeedback = gl.createTransformFeedback();
  if (!transformFeedback) throw new Error('Failed to create transform feedback ' + glErrorString(gl));

  // Get Uniform Locations
  const timeDeltaLocation = getUniformLocationVerified(gl, program, 'timeDelt');
  const gravityLocation = getUniformLocationVerified(gl, program, 'gravity');
  const bufferSizeLocation = getUniformLocationVerified(gl, program, 'bufferSize');

  return {
    program,
    timeDeltaLocation,
    gravityLocation,
    bufferSizeLocation,
    transformFeedback,
    destroy
  };

  function destroy() {
    gl.deleteProgram(program);
    gl.deleteTransformFeedback(transformFeedback);
  }
}