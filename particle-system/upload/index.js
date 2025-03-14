// @ts-check

export { upload } from './upload.js';

/**
 * @template {import('..').ParticleCore} TParticle
 * @typedef {{
 *  particles: TParticle[],
 *  dynamicBuffer: WebGLBuffer,
 *  dynamicBufferOut: WebGLBuffer,
 *  staticBuffer: WebGLBuffer,
 *  staticBufferOut: WebGLBuffer,
 *  ordersBuffer: WebGLBuffer,
 *  ordersBufferOut: WebGLBuffer,
 *  uploadProgram: WebGLProgram,
 *  computeState: import('../compute/index.js').GLComputeState,
 * }} ParticleSystemState
 */