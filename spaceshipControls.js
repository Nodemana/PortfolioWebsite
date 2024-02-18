import * as THREE from 'three';

let speed = 0;
const maxSpeed = 0.5;
const acceleration = 0.01;
let accumulatedPitch = 0;
let accumulatedYaw = 0;
let accumulatedRoll = 0;
let movingForward = false;
let movingBackward = false;
let rollingLeft = false;
let rollingRight = false;
const rotationSensitivity = 0.002;
const rollSensitivity = 0.02;
const maxPitch = Math.PI / 2; // Maximum pitch angle

export function initSpaceshipControls(camera, spaceship) {
    document.addEventListener('mousemove', (event) => {
        // Accumulate yaw and pitch separately
        accumulatedYaw -= event.movementX * rotationSensitivity;
        accumulatedPitch -= event.movementY * rotationSensitivity;

        // Clamp the pitch to the maximum allowed value
        accumulatedPitch = Math.max(-maxPitch, Math.min(maxPitch, accumulatedPitch));
    });

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW': movingForward = true; break;
            case 'KeyS': movingBackward = true; break;
            case 'KeyA': rollingLeft = true; break;
            case 'KeyD': rollingRight = true; break;
        }
    });
      
    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW': movingForward = false; break;
            case 'KeyS': movingBackward = false; break;
            case 'KeyA': rollingLeft = false; break;
            case 'KeyD': rollingRight = false; break;
        }
    });
}

export function updateSpaceship(camera, spaceship) {
    // Update speed and roll based on key inputs
    if (movingForward) speed = Math.min(speed + acceleration, maxSpeed);
    if (movingBackward) speed = Math.max(speed - acceleration, -maxSpeed);
    if (rollingLeft) accumulatedRoll -= rollSensitivity;
    if (rollingRight) accumulatedRoll += rollSensitivity;

    // Apply yaw (rotation around the vertical axis) and pitch (rotation around the lateral axis)
    spaceship.rotateOnAxis(new THREE.Vector3(0, 1, 0), accumulatedYaw);
    spaceship.rotateOnAxis(new THREE.Vector3(1, 0, 0), accumulatedPitch);

    // Apply roll rotation
    spaceship.rotation.z = accumulatedRoll;

    // Reset accumulated yaw and pitch
    accumulatedYaw = 0;
    accumulatedPitch = 0;

    // Move spaceship in the direction it's facing
    const direction = new THREE.Vector3();
    spaceship.getWorldDirection(direction);
    spaceship.position.addScaledVector(direction, speed);

    // Update camera position
    const relativeCameraOffset = new THREE.Vector3(0, -10, -30); // Adjust X, Y, Z as needed
    const cameraOffset = relativeCameraOffset.applyMatrix4(spaceship.matrixWorld);
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;

    // Adjust the camera to look slightly down towards the spaceship
    const lookAtPosition = spaceship.position.clone();
    lookAtPosition.y += 3; // Adjust as needed to change the angle
    camera.lookAt(lookAtPosition);
}

