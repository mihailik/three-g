# THREE-g — Galaxy Primitives for THREE.js

GPU-accelerated particle rendering and Barnes-Hut N-body physics for THREE.js.

**This library includes mass particle rendering that works awesomely nice and produces beautiful visuals** through a combination of GPU-based physics simulation and efficient instanced rendering with glow effects.

## Features

- **massSpotMesh**: Efficient particle rendering with beautiful glow effects and fog
- **particleSystem**: GPU-based O(N log N) Barnes-Hut gravitational physics
- Scales to 50,000+ particles at 30-40 FPS with full physics
- Zero CPU involvement: all computation stays on GPU
- GPU-to-GPU zero-copy texture pipeline for maximum performance

## Quick Start

```javascript
import * as THREE from 'three';
import { createScene } from 'three-pop';
import { massSpotMesh, particleSystem } from 'three-g';

const { scene, renderer } = createScene();

// Create physics system
const physics = particleSystem({
  gl: renderer.getContext(),
  particleCount: 50000
});

// Create rendering mesh with beautiful particle visuals
const mesh = massSpotMesh({
  textureMode: true,
  particleCount: physics.options.particleCount,
  textures: {
    position: physics.getPositionTexture(),
    color: physics.getColorTexture(),
    size: [512, 512]
  }
});

scene.add(mesh);

// Animation loop - updates physics and textures
function animate() {
  physics.compute();
  
  // Swap ping-pong buffers for zero-copy GPU pipeline
  const currentIndex = physics.getCurrentIndex();
  const positionTextures = physics.getPositionTextures();
  mesh.material.uniforms.u_positionTexture.value = 
    new THREE.ExternalTexture(positionTextures[currentIndex]);
  mesh.material.uniforms.u_positionTexture.value.needsUpdate = true;
}
```

## API

### particleSystem(options)

Creates GPU-based Barnes-Hut N-body particle simulation with beautiful rendering.

**Options**:
- `gl`: WebGL2 context (required)
- `particleCount`: Number of particles (default: 200000)
- `theta`: Barnes-Hut approximation threshold (default: 0.5)
- `gravityStrength`: Force multiplier (default: 0.0003)
- `worldBounds`: Simulation bounds

**Returns**: System object with methods:
- `compute()`: Step simulation forward
- `getPositionTexture()`: Get current positions (GPU texture)
- `getColorTexture()`: Get particle colors (GPU texture)
- `getTextureSize()`: Get texture dimensions

### massSpotMesh(options)

Creates particle rendering mesh.

**Texture Mode** (GPU-resident data):
```javascript
massSpotMesh({
  textureMode: true,
  particleCount: 50000,
  textures: { position, color, size }
})
```

**Array Mode** (CPU data):
```javascript
massSpotMesh({
  spots: [{ x, y, z, mass, rgb }, ...]
})
```

## License

MIT © Oleg Mihailik