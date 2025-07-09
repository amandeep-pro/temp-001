import * as THREE from 'three';

export class Utils {
    // Check collision between two 3D objects using bounding boxes
    static checkCollision(object1, object2) {
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);
        return box1.intersectsBox(box2);
    }

    // Check collision using distance (alternative method)
    static checkCollisionDistance(object1, object2, threshold = 1.5) {
        const distance = object1.position.distanceTo(object2.position);
        return distance < threshold;
    }

    // Generate random position within bounds
    static generateRandomPosition(minX = -8, maxX = 8, y = 15, minZ = -2, maxZ = 2) {
        return new THREE.Vector3(
            Math.random() * (maxX - minX) + minX,
            y,
            Math.random() * (maxZ - minZ) + minZ
        );
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Calculate distance between two 3D points
    static distance3D(point1, point2) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2) +
            Math.pow(point1.z - point2.z, 2)
        );
    }

    // Random number between min and max
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Check if object is within screen bounds
    static isInBounds(object, bounds = { x: 10, y: 20, z: 10 }) {
        const pos = object.position;
        return pos.x >= -bounds.x && pos.x <= bounds.x &&
               pos.y >= -bounds.y && pos.y <= bounds.y &&
               pos.z >= -bounds.z && pos.z <= bounds.z;
    }

    // Format time to MM:SS format
    static formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Generate random color
    static randomColor() {
        return new THREE.Color(Math.random(), Math.random(), Math.random());
    }

    // Create a simple particle effect (for future enhancements)
    static createExplosion(position, scene, count = 10) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: Utils.randomColor(),
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            scene.add(particle);
            particles.push(particle);
        }
        return particles;
    }

    // Dispose of Three.js objects properly
    static disposeObject(object) {
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    }
}