import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class CityMap {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.buildingCount = 0;
        this.clock = new THREE.Clock();
        
        this.init();
        this.createCity();
        this.animate();
        this.updateStats();
    }

    init() {
        // Enhanced renderer settings
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Scene background
        this.scene.background = new THREE.Color(0x001f3f);
        this.scene.fog = new THREE.Fog(0x001f3f, 50, 150);

        // Camera setup
        this.camera.position.set(70, 60, 70);
        this.camera.lookAt(0, 0, 0);

        // Enhanced controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.setupLights();
        this.createGround();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Add point lights for night effect
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 0.5, 20);
            light.position.set(
                Math.sin(i * Math.PI / 2) * 30,
                5,
                Math.cos(i * Math.PI / 2) * 30
            );
            this.scene.add(light);
        });
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createBuilding(x, z) {
        const height = Math.random() * 20 + 10;
        const width = Math.random() * 2 + 2;
        const depth = Math.random() * 2 + 2;

        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5),
            metalness: 0.3,
            roughness: 0.7
        });

        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height/2, z);
        building.castShadow = true;
        building.receiveShadow = true;

        // Add windows
        this.addWindows(building, width, height, depth);

        return building;
    }

    addWindows(building, width, height, depth) {
        const windowGeometry = new THREE.PlaneGeometry(0.3, 0.5);
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0x555500,
            side: THREE.DoubleSide
        });

        for (let y = 1; y < height - 1; y += 2) {
            for (let x = -width/2 + 1; x < width/2; x += 1) {
                if (Math.random() > 0.3) { // 70% chance of window
                    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window1.position.set(x, y, depth/2 + 0.01);
                    building.add(window1);

                    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window2.position.set(x, y, -depth/2 - 0.01);
                    window2.rotation.y = Math.PI;
                    building.add(window2);
                }
            }
        }
    }

    createCity() {
        const buildingGroup = new THREE.Group();
        
        for (let x = -40; x <= 40; x += 4) {
            for (let z = -40; z <= 40; z += 4) {
                if (Math.random() > 0.2) { // 80% chance of building
                    const building = this.createBuilding(x, z);
                    buildingGroup.add(building);
                    this.buildingCount++;
                }
            }
        }
        
        this.scene.add(buildingGroup);
        document.getElementById('buildingCount').textContent = this.buildingCount;
    }

    updateStats() {
        const fps = Math.round(1 / this.clock.getDelta());
        document.getElementById('fps').textContent = fps;
        setTimeout(() => this.updateStats(), 1000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the city map
new CityMap();
