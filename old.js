import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Spaceship movement
let speed = 0;
let maxSpeed = 0.5;
let acceleration = 0.01;

let targetRotation = new THREE.Vector3();

// Initiate Pointer Lock
renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock ||
                                        renderer.domElement.mozRequestPointerLock;
document.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});

// Spaceship rotation increments
let rotationIncrementX = 0;
let rotationIncrementY = 0;
const rotationSensitivity = 0.002; // Adjust sensitivity

document.addEventListener('mousemove', (event) => {
  rotationIncrementX = event.movementY * rotationSensitivity;
  rotationIncrementY = event.movementX * rotationSensitivity;
});
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyS') speed = Math.min(speed + acceleration, maxSpeed);
  if (event.code === 'KeyW') speed = Math.max(speed - acceleration, -maxSpeed);
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyW' || event.code === 'KeyS') speed *= 0.95; // Deceleration
});


renderer.render( scene, camera);

//TORUS
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)

//LIGHTING
const pointLight = new THREE.PointLight(0xf70c0c);
pointLight.position.set(20,20,20);

const ambientLight = new THREE.AmbientLight(0xf70c0c);
scene.add(pointLight, ambientLight);

//GRID
const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper);

// Space ship placeholder - Pyramid
const spaceshipGeometry = new THREE.ConeGeometry(4, 5, 4);
const spaceshipMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
spaceship.position.set(0, 0, 0);
scene.add(spaceship);

const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff})

function addStar() {

  const star = new THREE.Mesh( starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);

}

Array(200).fill().forEach(addStar)

function animate() {
  requestAnimationFrame( animate);

  // Apply incremental rotation to the spaceship
  spaceship.rotation.x += rotationIncrementX;
  spaceship.rotation.y += rotationIncrementY;

  // Reset rotation increments
  rotationIncrementX = 0;
  rotationIncrementY = 0;

  // Move spaceship
  const direction = new THREE.Vector3();
  spaceship.getWorldDirection(direction);
  spaceship.position.addScaledVector(direction, speed);

  // Update camera position
  const relativeCameraOffset = new THREE.Vector3(0, 10, 30);
  const cameraOffset = relativeCameraOffset.applyMatrix4(spaceship.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  camera.lookAt(spaceship.position);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //controls.update();

  renderer.render(scene, camera);
}

animate();