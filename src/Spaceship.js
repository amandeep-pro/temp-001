import * as THREE from 'three';

export class Spaceship {
    constructor() {
        this.mesh = null;
        this.speed = 0.3;
        this.bounds = 8; // Movement boundaries
        this.createMesh();
    }

    createMesh() {
        // Create a simple cone for the spaceship
        const geometry = new THREE.ConeGeometry(0.5, 2, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Position the spaceship
        this.mesh.position.set(0, -5, 0);
        this.mesh.rotation.x = Math.PI; // Point upward
        
        // Enable shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add a glowing effect
        const glowGeometry = new THREE.ConeGeometry(0.6, 2.2, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.3 
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = Math.PI;
        this.mesh.add(glow);
    }

    update(keys) {
        // Handle left/right movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.mesh.position.x -= this.speed;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.mesh.position.x += this.speed;
        }
        
        // Keep spaceship within bounds
        this.mesh.position.x = Math.max(-this.bounds, Math.min(this.bounds, this.mesh.position.x));
        
        // Add slight rotation for movement feedback
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.mesh.rotation.z = Math.min(this.mesh.rotation.z + 0.1, 0.3);
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.mesh.rotation.z = Math.max(this.mesh.rotation.z - 0.1, -0.3);
        } else {
            // Return to center rotation
            this.mesh.rotation.z *= 0.9;
        }
    }

    reset() {
        this.mesh.position.set(0, -5, 0);
        this.mesh.rotation.x = Math.PI;
        this.mesh.rotation.z = 0;
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    getBoundingBox() {
        const box = new THREE.Box3().setFromObject(this.mesh);
        return box;
    }
}