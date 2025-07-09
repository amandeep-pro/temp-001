import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Utils } from '../src/Utils.js';
import * as THREE from 'three';

describe('Utils', () => {
    let object1, object2, scene;

    beforeEach(() => {
        // Create test objects
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial();
        
        object1 = new THREE.Mesh(geometry, material);
        object2 = new THREE.Mesh(geometry, material);
        
        scene = new THREE.Scene();
        scene.add(object1);
        scene.add(object2);
    });

    describe('Collision Detection', () => {
        it('should detect collision when objects overlap', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(0.5, 0, 0); // Overlapping
            
            const collision = Utils.checkCollision(object1, object2);
            
            expect(collision).toBe(true);
        });

        it('should not detect collision when objects are apart', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(5, 0, 0); // Far apart
            
            const collision = Utils.checkCollision(object1, object2);
            
            expect(collision).toBe(false);
        });

        it('should detect collision when objects are touching', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(1, 0, 0); // Touching edges
            
            const collision = Utils.checkCollision(object1, object2);
            
            expect(collision).toBe(true);
        });

        it('should detect collision using distance method', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(1, 0, 0); // Distance = 1
            
            const collision = Utils.checkCollisionDistance(object1, object2, 1.5);
            
            expect(collision).toBe(true);
        });

        it('should not detect collision using distance method when too far', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(5, 0, 0); // Distance = 5
            
            const collision = Utils.checkCollisionDistance(object1, object2, 1.5);
            
            expect(collision).toBe(false);
        });

        it('should use default threshold for distance collision', () => {
            object1.position.set(0, 0, 0);
            object2.position.set(1, 0, 0); // Distance = 1
            
            const collision = Utils.checkCollisionDistance(object1, object2);
            
            expect(collision).toBe(true);
        });
    });

    describe('Position Generation', () => {
        it('should generate random position within bounds', () => {
            const position = Utils.generateRandomPosition(-5, 5, 10, -2, 2);
            
            expect(position.x).toBeGreaterThanOrEqual(-5);
            expect(position.x).toBeLessThanOrEqual(5);
            expect(position.y).toBe(10);
            expect(position.z).toBeGreaterThanOrEqual(-2);
            expect(position.z).toBeLessThanOrEqual(2);
        });

        it('should use default bounds when no parameters provided', () => {
            const position = Utils.generateRandomPosition();
            
            expect(position.x).toBeGreaterThanOrEqual(-8);
            expect(position.x).toBeLessThanOrEqual(8);
            expect(position.y).toBe(15);
            expect(position.z).toBeGreaterThanOrEqual(-2);
            expect(position.z).toBeLessThanOrEqual(2);
        });

        it('should return THREE.Vector3 instance', () => {
            const position = Utils.generateRandomPosition();
            
            expect(position).toBeInstanceOf(THREE.Vector3);
        });
    });

    describe('Mathematical Utilities', () => {
        it('should clamp value between min and max', () => {
            expect(Utils.clamp(5, 0, 10)).toBe(5);
            expect(Utils.clamp(-5, 0, 10)).toBe(0);
            expect(Utils.clamp(15, 0, 10)).toBe(10);
        });

        it('should perform linear interpolation', () => {
            expect(Utils.lerp(0, 10, 0.5)).toBe(5);
            expect(Utils.lerp(0, 10, 0)).toBe(0);
            expect(Utils.lerp(0, 10, 1)).toBe(10);
        });

        it('should calculate 3D distance correctly', () => {
            const point1 = { x: 0, y: 0, z: 0 };
            const point2 = { x: 3, y: 4, z: 0 };
            
            const distance = Utils.distance3D(point1, point2);
            
            expect(distance).toBe(5); // 3-4-5 triangle
        });

        it('should generate random number in range', () => {
            const random = Utils.randomRange(10, 20);
            
            expect(random).toBeGreaterThanOrEqual(10);
            expect(random).toBeLessThanOrEqual(20);
        });
    });

    describe('Boundary Checking', () => {
        it('should detect object within bounds', () => {
            object1.position.set(0, 0, 0);
            
            const inBounds = Utils.isInBounds(object1, { x: 10, y: 10, z: 10 });
            
            expect(inBounds).toBe(true);
        });

        it('should detect object outside bounds', () => {
            object1.position.set(15, 0, 0);
            
            const inBounds = Utils.isInBounds(object1, { x: 10, y: 10, z: 10 });
            
            expect(inBounds).toBe(false);
        });

        it('should use default bounds when not specified', () => {
            object1.position.set(0, 0, 0);
            
            const inBounds = Utils.isInBounds(object1);
            
            expect(inBounds).toBe(true);
        });

        it('should check all three dimensions', () => {
            object1.position.set(0, 25, 0); // Y out of bounds
            
            const inBounds = Utils.isInBounds(object1, { x: 10, y: 20, z: 10 });
            
            expect(inBounds).toBe(false);
        });
    });

    describe('Time Formatting', () => {
        it('should format time in MM:SS format', () => {
            expect(Utils.formatTime(60000)).toBe('01:00'); // 1 minute
            expect(Utils.formatTime(90000)).toBe('01:30'); // 1.5 minutes
            expect(Utils.formatTime(0)).toBe('00:00');
        });

        it('should pad single digits with zeros', () => {
            expect(Utils.formatTime(5000)).toBe('00:05');
            expect(Utils.formatTime(65000)).toBe('01:05');
        });

        it('should handle large times', () => {
            expect(Utils.formatTime(660000)).toBe('11:00'); // 11 minutes
        });
    });

    describe('Color Utilities', () => {
        it('should generate random color', () => {
            const color = Utils.randomColor();
            
            expect(color).toBeInstanceOf(THREE.Color);
            expect(color.r).toBeGreaterThanOrEqual(0);
            expect(color.r).toBeLessThanOrEqual(1);
            expect(color.g).toBeGreaterThanOrEqual(0);
            expect(color.g).toBeLessThanOrEqual(1);
            expect(color.b).toBeGreaterThanOrEqual(0);
            expect(color.b).toBeLessThanOrEqual(1);
        });

        it('should generate different colors', () => {
            const color1 = Utils.randomColor();
            const color2 = Utils.randomColor();
            
            // Very unlikely to be exactly the same
            expect(color1.getHex()).not.toBe(color2.getHex());
        });
    });

    describe('Explosion Effect', () => {
        it('should create explosion particles', () => {
            const position = new THREE.Vector3(0, 0, 0);
            const particles = Utils.createExplosion(position, scene, 5);
            
            expect(particles).toHaveLength(5);
            expect(scene.children.length).toBe(7); // 2 original + 5 particles
        });

        it('should position particles at explosion location', () => {
            const position = new THREE.Vector3(5, 10, 15);
            const particles = Utils.createExplosion(position, scene, 3);
            
            particles.forEach(particle => {
                expect(particle.position.x).toBe(5);
                expect(particle.position.y).toBe(10);
                expect(particle.position.z).toBe(15);
            });
        });

        it('should give particles random velocities', () => {
            const position = new THREE.Vector3(0, 0, 0);
            const particles = Utils.createExplosion(position, scene, 3);
            
            particles.forEach(particle => {
                expect(particle.velocity).toBeDefined();
                expect(particle.velocity).toBeInstanceOf(THREE.Vector3);
            });
        });

        it('should use default particle count', () => {
            const position = new THREE.Vector3(0, 0, 0);
            const particles = Utils.createExplosion(position, scene);
            
            expect(particles).toHaveLength(10); // Default count
        });
    });

    describe('Resource Management', () => {
        it('should dispose of geometry and material', () => {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial();
            const object = new THREE.Mesh(geometry, material);
            
            const geometryDisposeSpy = vi.spyOn(geometry, 'dispose');
            const materialDisposeSpy = vi.spyOn(material, 'dispose');
            
            Utils.disposeObject(object);
            
            expect(geometryDisposeSpy).toHaveBeenCalled();
            expect(materialDisposeSpy).toHaveBeenCalled();
        });

        it('should handle array of materials', () => {
            const geometry = new THREE.BoxGeometry();
            const material1 = new THREE.MeshBasicMaterial();
            const material2 = new THREE.MeshBasicMaterial();
            const object = new THREE.Mesh(geometry, [material1, material2]);
            
            const material1DisposeSpy = vi.spyOn(material1, 'dispose');
            const material2DisposeSpy = vi.spyOn(material2, 'dispose');
            
            Utils.disposeObject(object);
            
            expect(material1DisposeSpy).toHaveBeenCalled();
            expect(material2DisposeSpy).toHaveBeenCalled();
        });

        it('should handle object without geometry', () => {
            const object = { material: new THREE.MeshBasicMaterial() };
            
            expect(() => Utils.disposeObject(object)).not.toThrow();
        });

        it('should handle object without material', () => {
            const object = { geometry: new THREE.BoxGeometry() };
            
            expect(() => Utils.disposeObject(object)).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null objects in collision detection', () => {
            expect(() => Utils.checkCollision(null, object1)).toThrow();
        });

        it('should handle zero distance in distance calculation', () => {
            const point1 = { x: 0, y: 0, z: 0 };
            const point2 = { x: 0, y: 0, z: 0 };
            
            const distance = Utils.distance3D(point1, point2);
            
            expect(distance).toBe(0);
        });

        it('should handle min equals max in clamp', () => {
            expect(Utils.clamp(5, 10, 10)).toBe(10);
        });

        it('should handle zero range in randomRange', () => {
            const random = Utils.randomRange(5, 5);
            
            expect(random).toBe(5);
        });
    });
});