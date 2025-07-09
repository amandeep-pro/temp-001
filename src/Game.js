import * as THREE from 'three';
import { Spaceship } from './Spaceship.js';
import { Asteroid } from './Asteroid.js';
import { Utils } from './Utils.js';

export class Game {
    constructor(testMode = false) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.spaceship = null;
        this.asteroids = [];
        this.score = 0;
        this.isGameOver = false;
        this.gameStartTime = Date.now();
        this.lastAsteroidSpawn = Date.now();
        this.animationId = null;
        this.testMode = testMode;
        
        // Game settings
        this.asteroidSpawnInterval = 1000; // Start with 1 second
        this.asteroidSpeedMultiplier = 1;
        this.gameSpeed = 1;
        
        // DOM elements
        this.scoreElement = document.getElementById('score') || { textContent: '0' };
        this.finalScoreElement = document.getElementById('finalScore') || { textContent: '0' };
        this.gameOverScreen = document.getElementById('gameOverScreen') || { style: { display: 'none' } };
        this.restartButton = document.getElementById('restartButton') || { addEventListener: () => {} };
        
        // Event listeners
        this.keys = {};
        this.setupEventListeners();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createSpaceship();
        this.resetGame();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // Add stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 1000;
        const positions = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        if (this.testMode) {
            // Create a mock renderer for testing
            this.renderer = {
                domElement: document.createElement('canvas'),
                setSize: () => {},
                shadowMap: { enabled: true, type: null },
                render: () => {}
            };
            return;
        }
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.renderer.domElement);
        }
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createSpaceship() {
        this.spaceship = new Spaceship();
        this.scene.add(this.spaceship.mesh);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    spawnAsteroid() {
        const asteroid = new Asteroid();
        this.asteroids.push(asteroid);
        this.scene.add(asteroid.mesh);
    }

    updateAsteroids() {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update(this.gameSpeed);
            
            // Remove asteroids that are too far down
            if (asteroid.mesh.position.y < -20) {
                this.scene.remove(asteroid.mesh);
                this.asteroids.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            if (Utils.checkCollision(this.spaceship.mesh, asteroid.mesh)) {
                this.gameOver();
                return;
            }
        }
    }

    updateScore() {
        this.score = Math.floor((Date.now() - this.gameStartTime) / 100);
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
    }

    updateDifficulty() {
        const timeElapsed = Date.now() - this.gameStartTime;
        
        // Increase game speed gradually
        this.gameSpeed = 1 + (timeElapsed / 30000); // Increase by 1 every 30 seconds
        
        // Reduce spawn interval (increase frequency)
        this.asteroidSpawnInterval = Math.max(300, 1000 - (timeElapsed / 50));
        
        // Increase asteroid speed
        this.asteroidSpeedMultiplier = 1 + (timeElapsed / 60000); // Increase by 1 every minute
    }

    gameOver() {
        this.isGameOver = true;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.style.display = 'block';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    restartGame() {
        this.resetGame();
        this.gameOverScreen.style.display = 'none';
        this.animate();
    }

    resetGame() {
        this.isGameOver = false;
        this.score = 0;
        this.gameStartTime = Date.now();
        this.lastAsteroidSpawn = Date.now();
        this.gameSpeed = 1;
        this.asteroidSpawnInterval = 1000;
        this.asteroidSpeedMultiplier = 1;
        
        // Clear existing asteroids
        this.asteroids.forEach(asteroid => {
            this.scene.remove(asteroid.mesh);
        });
        this.asteroids = [];
        
        // Reset spaceship position
        if (this.spaceship) {
            this.spaceship.reset();
        }
        
        this.updateScore();
    }

    animate() {
        if (this.isGameOver) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update spaceship
        if (this.spaceship) {
            this.spaceship.update(this.keys);
        }
        
        // Spawn asteroids
        const now = Date.now();
        if (now - this.lastAsteroidSpawn > this.asteroidSpawnInterval) {
            this.spawnAsteroid();
            this.lastAsteroidSpawn = now;
        }
        
        // Update asteroids
        this.updateAsteroids();
        
        // Check collisions
        this.checkCollisions();
        
        // Update score and difficulty
        this.updateScore();
        this.updateDifficulty();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.remove();
        }
        
        // Clear asteroids
        this.asteroids.forEach(asteroid => {
            if (asteroid.mesh) {
                this.scene.remove(asteroid.mesh);
            }
        });
        this.asteroids = [];
        
        // Clear spaceship
        if (this.spaceship && this.spaceship.mesh) {
            this.scene.remove(this.spaceship.mesh);
        }
    }
}