function animate(scene, camera, renderer, updateSpaceshipFn, updateObjectsFn) {
    requestAnimationFrame(() => animate(scene, camera, renderer, updateSpaceshipFn, updateObjectsFn));
    
    updateSpaceshipFn();
    updateObjectsFn();
    
    renderer.render(scene, camera);
  }
  
  export { animate };