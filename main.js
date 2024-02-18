import './style.css'
import { initScene, camera, renderer, scene } from './sceneSetup';
import { initSpaceshipControls, updateSpaceship } from './spaceshipControls';
import { createObjects, updateObjects } from './createObjects';
import { animate } from './animate';

initScene();

// Create objects
const { torus } = createObjects(scene, (spaceship) => {
  // This function is called once the spaceship is loaded
  initSpaceshipControls(camera, spaceship);
  animate(scene, camera, renderer, 
      () => updateSpaceship(camera, spaceship), 
      () => updateObjects(torus));
});


// Initiate Pointer Lock
renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock ||
                                        renderer.domElement.mozRequestPointerLock;
document.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});
