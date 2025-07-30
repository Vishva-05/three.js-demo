let scene, camera, renderer, clock;
let buildings = [], lights = [];
let buildingCount = 0;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 60, 100);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Clock for animations
    clock = new THREE.Clock();

    createLights();
    createGround();
    createCity();
    createStars();

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    animate();
    window.addEventListener('resize', onWindowResize, false);
}

function createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(100, 100, 100);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // City lights
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    for (let i = 0; i < 20; i++) {
        const light = new THREE.PointLight(
            colors[Math.floor(Math.random() * colors.length)],
            0.5,
            20
        );
        light.position.set(
            Math.random() * 100 - 50,
            Math.random() * 20 + 5,
            Math.random() * 100 - 50
        );
        lights.push(light);
        scene.add(light);
    }
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

function createBuilding(x, z) {
    const height = Math.random() * 30 + 10;
    const geometry = new THREE.BoxGeometry(5, height, 5);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        shininess: 30,
        emissive: new THREE.Color(0x111111)
    });
    
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height/2, z);
    building.castShadow = true;
    building.receiveShadow = true;

    // Add windows
    addWindows(building, height);
    
    return building;
}

function addWindows(building, height) {
    const windowGeometry = new THREE.PlaneGeometry(0.5, 0.8);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });

    for (let y = 1; y < height - 1; y += 2) {
        for (let x = -2; x <= 2; x += 1) {
            if (Math.random() > 0.3) {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(x, y, 2.51);
                building.add(window);

                const windowBack = window.clone();
                windowBack.position.z = -2.51;
                building.add(windowBack);
            }
        }
    }
}

function createCity() {
    for (let x = -50; x <= 50; x += 10) {
        for (let z = -50; z <= 50; z += 10) {
            if (Math.random() > 0.2) {
                const building = createBuilding(x, z);
                buildings.push(building);
                scene.add(building);
                buildingCount++;
            }
        }
    }
    document.getElementById('buildingCount').textContent = buildingCount;
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Animate buildings
    buildings.forEach((building, index) => {
        building.scale.y = 1 + Math.sin(time + index) * 0.05;
    });

    // Animate lights
    lights.forEach((light, index) => {
        light.intensity = 0.5 + Math.sin(time * 2 + index) * 0.3;
    });

    // Update FPS counter
    document.getElementById('fps').textContent = Math.round(1 / clock.getDelta());

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
