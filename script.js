let scene, camera, renderer;
let buildings = [];

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('cityCanvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x404040,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Generate buildings
    generateCity();

    // Animation loop
    animate();
}

function generateCity() {
    for (let i = 0; i < 50; i++) {
        const width = Math.random() * 5 + 2;
        const height = Math.random() * 20 + 10;
        const depth = Math.random() * 5 + 2;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            flatShading: true
        });

        const building = new THREE.Mesh(geometry, material);
        
        // Position buildings randomly on the ground
        building.position.x = Math.random() * 80 - 40;
        building.position.y = height / 2;
        building.position.z = Math.random() * 80 - 40;

        buildings.push(building);
        scene.add(building);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera around the scene
    camera.position.x = Math.cos(Date.now() * 0.0001) * 70;
    camera.position.z = Math.sin(Date.now() * 0.0001) * 70;
    camera.lookAt(0, 0, 0);

    // Update building colors based on time
    buildings.forEach(building => {
        building.rotation.y += 0.001;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
init();
