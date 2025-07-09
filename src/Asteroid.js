import * as THREE from 'three';

export class Asteroid {
    constructor() {
        this.mesh = null;
        this.speed = Math.random() * 0.1 + 0.05; // Random speed between 0.05 and 0.15
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        };
        this.createMesh();
    }

    createMesh() {
        // Create an irregular asteroid shape
        const geometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.3, 1);
        
        // Randomly modify vertices for more irregular shape
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const scale = 0.8 + Math.random() * 0.4;
            vertices[i] *= scale;
            vertices[i + 1] *= scale;
            vertices[i + 2] *= scale;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Create material with random color variation
        const hue = Math.random() * 60 + 20; // Brown to orange range
        const material = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(hue / 360, 0.6, 0.4)
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Random starting position
        this.mesh.position.set(
            (Math.random() - 0.5) * 16, // X position within bounds
            15, // Start above screen
            (Math.random() - 0.5) * 5   // Slight Z variation
        );
        
        // Random initial rotation
        this.mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Enable shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    update(gameSpeed = 1) {
        // Move asteroid downward
        this.mesh.position.y -= this.speed * gameSpeed;
        
        // Rotate asteroid
        this.mesh.rotation.x += this.rotationSpeed.x * gameSpeed;
        this.mesh.rotation.y += this.rotationSpeed.y * gameSpeed;
        this.mesh.rotation.z += this.rotationSpeed.z * gameSpeed;
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    getBoundingBox() {
        const box = new THREE.Box3().setFromObject(this.mesh);
        return box;
    }

    destroy() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }
}