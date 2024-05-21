import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, star, controls, buttonDiv;

function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Load and add the GLTF models to the scene
    loadModel('assets/floatingstar.gltf', (gltf) => {
        star = gltf.scene;
        star.name = 'star';
        star.scale.set(5, 5, 5);
        star.position.set(0, 0, 0);
        scene.add(star);

        // Create button sprite and position it above the star
        createButtonSprite();

        // Animate the button along with the star
        animateButton();
    });

    // Load and add three flowers at different positions
    loadFlower('assets/scene.gltf', 60, 0, -60);
    loadFlower('assets/scene.gltf', -60, 0, -30);
    loadFlower('assets/scene.gltf', 0, 0, 60); // Third flower at a different position

    // Add lighting
    addLighting();

    // Add stars to the scene
    Array(200).fill().forEach(addStar);

    // Add space background texture
    const spaceTexture = new THREE.TextureLoader().load('textures/wfb.jpg');
    scene.background = spaceTexture;

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function loadModel(path, onLoad) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
        onLoad(gltf);
    });
}

function loadFlower(path, x, y, z) {
    const loader = new GLTFLoader();
    loader.load(path, function (gltf) {
        const flower = gltf.scene;
        flower.scale.set(5, 5, 5);
        flower.position.set(x, y, z);

        // Update materials if needed
        flower.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = false;
                child.material.opacity = 1.0;
            }
        });

        scene.add(flower);
    });
}

function addLighting() {
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(lightHelper, gridHelper);
}

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the star if it has been loaded
    if (star) {
        star.rotation.x += 0.005;
        star.rotation.y += 0.005;
        star.rotation.z += 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}

function createButtonSprite() {
    // Create a div element for the button
    buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = '<a href="comment.html" class="purple-button">Go to Comment Page</a>';
    buttonDiv.className = 'sprite';

    // Append the button to the document body
    document.body.appendChild(buttonDiv);

    updateButtonPosition();
}

function updateButtonPosition() {
    if (star && buttonDiv) {
        const starPosition = new THREE.Vector3();
        star.getWorldPosition(starPosition);

        // Adjust the height above the star
        const buttonPosition = starPosition.clone();
        buttonPosition.y += 5;

        // Project 3D position to 2D screen coordinates
        const screenPosition = buttonPosition.clone().project(camera);

        // Convert screen coordinates to CSS coordinates
        const canvas = renderer.domElement;
        const widthHalf = canvas.width / 2;
        const heightHalf = canvas.height / 2;

        const x = (screenPosition.x * widthHalf) + widthHalf;
        const y = -(screenPosition.y * heightHalf) + heightHalf;

        // Set button position
        buttonDiv.style.left = `${x}px`;
        buttonDiv.style.top = `${y}px`;
    }
}

function animateButton() {
    requestAnimationFrame(animateButton);

    // Update button position relative to the star's rotation
    updateButtonPosition();
}

init();
animate();
