// @ts-check

import { initCoordsObj } from './init-coords-obj.js';
import { storeInWebGLBuffers } from './store-in-gl-buffers.js';

/**
 * @param {Pick<ConstructorParameters<typeof import('../..').ParticleSystem>[0], 'particles' | 'get'>} _{
 * }} _
 */
export function readParticleData({ particles, get }) {
  const positionData = new Float32Array(particles.length * 3);
  const velocityData = new Float32Array(particles.length * 3);
  const massData = new Float32Array(particles.length);
  const cpuOriginalIndexData = new Int32Array(particles.length);

  const coords = {
    index: 0,
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    mass: 0,
    rgb: 0,
  };

  const bounds = {
    x: { min: NaN, max: NaN },
    y: { min: NaN, max: NaN },
    z: { min: NaN, max: NaN },
  };

  const bufState = {
    offset: 0,
    coords,
    positionData: positionData,
    velocityData: velocityData,
    massData: massData,
    bounds,
  };

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    cpuOriginalIndexData[i] = i;

    initCoordsObj(i, particle, coords);

    if (typeof get === 'function') get(particle, coords);

    bufState.offset = i;
    storeInWebGLBuffers(bufState);
  }

  return {
    positionData,
    velocityData,
    massData,
    cpuOriginalIndexData,
    bounds
  };
}
