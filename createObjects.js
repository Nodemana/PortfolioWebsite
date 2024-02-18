import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createObjects(scene, onSpaceshipLoaded) {
    //TORUS
    const geometry = new THREE.TorusGeometry(10,3,16,100);
    const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus)

    //LIGHTING
    const pointLight = new THREE.PointLight(0xf70c0c);
    pointLight.position.set(20,20,20);

    const ambientLight = new THREE.AmbientLight(0xf70c0c);

    const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);

    scene.add(pointLight, hemiLight, ambientLight);

    //GRID
    const gridHelper = new THREE.GridHelper(200,50);
    scene.add(gridHelper);

    //Skybox
    // Load the texture for the skybox
    const loader = new THREE.TextureLoader();
    const texture = loader.load('galaxy.jpg');

    // Create the material for the skybox
    const material2 = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide // Render the inside of the sphere
    });

    // Create the geometry for the skybox (a large sphere)
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32); // Adjust the size as needed

    // Create the mesh with the geometry and material
    const skybox = new THREE.Mesh(skyboxGeometry, material2);

    // Add the skybox to the scene
    scene.add(skybox);

    //Spaceship
    const GLTFloader = new GLTFLoader();
    GLTFloader.load('model/scene.gltf', (gltf) => {
        let spaceship = gltf.scene;
        spaceship.scale.set(0.5, 0.5, 0.5);
        spaceship.position.set(0, 20, 0);
        //
        console.log(spaceship.rotation.y);
        // Rotate the spaceship by 180 degrees
        //spaceship.rotation.y = Math.PI; // Rotate around the Y axis
    
        scene.add(spaceship);
        
    
        if (onSpaceshipLoaded) {
            spaceship.rotation.y = Math.PI;
            onSpaceshipLoaded(spaceship);
        }
    }, undefined, (error) => {
        console.error(error);
    });


    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff})

    function addStar() {

    const star = new THREE.Mesh( starGeometry, starMaterial);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);

    }

    Array(200).fill().forEach(addStar)

    return { torus }; // Return created objects
}

export function updateObjects(torus) {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

}
