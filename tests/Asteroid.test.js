import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Asteroid } from '../src/Asteroid.js';
import * as THREE from 'three';

describe('Asteroid', () => {
    let asteroid;

    beforeEach(() => {
        // Mock Math.random for consistent testing
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        asteroid = new Asteroid();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('should create an asteroid instance', () => {
            expect(asteroid).toBeDefined();
            expect(asteroid.mesh).toBeDefined();
            expect(asteroid.speed).toBeDefined();
            expect(asteroid.rotationSpeed).toBeDefined();
        });

        it('should have random speed within expected range', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            expect(asteroid1.speed).toBeGreaterThanOrEqual(0.05);
            expect(asteroid1.speed).toBeLessThanOrEqual(0.15);
            expect(asteroid2.speed).toBeGreaterThanOrEqual(0.05);
            expect(asteroid2.speed).toBeLessThanOrEqual(0.15);
        });

        it('should have random rotation speeds', () => {
            expect(asteroid.rotationSpeed.x).toBeDefined();
            expect(asteroid.rotationSpeed.y).toBeDefined();
            expect(asteroid.rotationSpeed.z).toBeDefined();
        });

        it('should start above the screen', () => {
            expect(asteroid.mesh.position.y).toBe(15);
        });

        it('should have random X position within bounds', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            expect(asteroid1.mesh.position.x).toBeGreaterThanOrEqual(-8);
            expect(asteroid1.mesh.position.x).toBeLessThanOrEqual(8);
            expect(asteroid2.mesh.position.x).toBeGreaterThanOrEqual(-8);
            expect(asteroid2.mesh.position.x).toBeLessThanOrEqual(8);
        });

        it('should have correct mesh geometry', () => {
            expect(asteroid.mesh.geometry).toBeInstanceOf(THREE.DodecahedronGeometry);
            expect(asteroid.mesh.material).toBeInstanceOf(THREE.MeshLambertMaterial);
        });
    });

    describe('Movement Physics', () => {
        it('should move downward when updated', () => {
            const initialY = asteroid.mesh.position.y;
            
            asteroid.update();
            
            expect(asteroid.mesh.position.y).toBeLessThan(initialY);
        });

        it('should move at correct speed', () => {
            const initialY = asteroid.mesh.position.y;
            const gameSpeed = 1;
            
            asteroid.update(gameSpeed);
            
            expect(asteroid.mesh.position.y).toBe(initialY - asteroid.speed);
        });

        it('should move faster with higher game speed', () => {
            const initialY = asteroid.mesh.position.y;
            const gameSpeed = 2;
            
            asteroid.update(gameSpeed);
            
            expect(asteroid.mesh.position.y).toBe(initialY - asteroid.speed * gameSpeed);
        });

        it('should rotate while moving', () => {
            vi.restoreAllMocks();
            const asteroid = new Asteroid();
            const initialRotationX = asteroid.mesh.rotation.x;
            const initialRotationY = asteroid.mesh.rotation.y;
            const initialRotationZ = asteroid.mesh.rotation.z;
            
            asteroid.update();
            
            // At least one rotation should change (due to random rotation speeds)
            const rotationChanged = 
                asteroid.mesh.rotation.x !== initialRotationX ||
                asteroid.mesh.rotation.y !== initialRotationY ||
                asteroid.mesh.rotation.z !== initialRotationZ;
            
            expect(rotationChanged).toBe(true);
        });

        it('should rotate at correct speed', () => {
            const initialRotationX = asteroid.mesh.rotation.x;
            const gameSpeed = 1;
            
            asteroid.update(gameSpeed);
            
            expect(asteroid.mesh.rotation.x).toBe(initialRotationX + asteroid.rotationSpeed.x);
        });

        it('should rotate faster with higher game speed', () => {
            const initialRotationX = asteroid.mesh.rotation.x;
            const gameSpeed = 2;
            
            asteroid.update(gameSpeed);
            
            expect(asteroid.mesh.rotation.x).toBe(initialRotationX + asteroid.rotationSpeed.x * gameSpeed);
        });
    });

    describe('Random Properties', () => {
        it('should have different speeds for different instances', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            // With true randomness, speeds should likely be different
            expect(asteroid1.speed).not.toBe(asteroid2.speed);
        });

        it('should have different rotation speeds for different instances', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            expect(asteroid1.rotationSpeed.x).not.toBe(asteroid2.rotationSpeed.x);
        });

        it('should have different starting positions', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            expect(asteroid1.mesh.position.x).not.toBe(asteroid2.mesh.position.x);
        });

        it('should have different colors', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            // Colors should be different due to random hue
            expect(asteroid1.mesh.material.color.getHex()).not.toBe(asteroid2.mesh.material.color.getHex());
        });
    });

    describe('Geometry Modifications', () => {
        it('should have irregular shape through vertex modification', () => {
            const geometry = asteroid.mesh.geometry;
            const vertices = geometry.attributes.position.array;
            
            // Check that vertices have been modified (not all the same)
            let allSame = true;
            for (let i = 3; i < vertices.length; i += 3) {
                if (vertices[i] !== vertices[0] || vertices[i + 1] !== vertices[1] || vertices[i + 2] !== vertices[2]) {
                    allSame = false;
                    break;
                }
            }
            
            expect(allSame).toBe(false);
        });

        it('should have proper normals computed', () => {
            const geometry = asteroid.mesh.geometry;
            
            expect(geometry.attributes.normal).toBeDefined();
            expect(geometry.attributes.normal.array.length).toBeGreaterThan(0);
        });
    });

    describe('Visual Properties', () => {
        it('should have shadow properties enabled', () => {
            expect(asteroid.mesh.castShadow).toBe(true);
            expect(asteroid.mesh.receiveShadow).toBe(true);
        });

        it('should have color in brown to orange range', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const color = asteroid1.mesh.material.color;
            const hsl = {};
            color.getHSL(hsl);
            
            // Should be in brown to orange range (20-80 degrees)
            expect(hsl.h).toBeGreaterThanOrEqual(20/360);
            expect(hsl.h).toBeLessThanOrEqual(80/360);
        });

        it('should have random initial rotation', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            expect(asteroid1.mesh.rotation.x).not.toBe(asteroid2.mesh.rotation.x);
            expect(asteroid1.mesh.rotation.y).not.toBe(asteroid2.mesh.rotation.y);
            expect(asteroid1.mesh.rotation.z).not.toBe(asteroid2.mesh.rotation.z);
        });
    });

    describe('Helper Methods', () => {
        it('should return correct position', () => {
            asteroid.mesh.position.set(1, 2, 3);
            const position = asteroid.getPosition();
            
            expect(position.x).toBe(1);
            expect(position.y).toBe(2);
            expect(position.z).toBe(3);
        });

        it('should return position as a clone', () => {
            const position = asteroid.getPosition();
            position.x = 100;
            
            expect(asteroid.mesh.position.x).not.toBe(100);
        });

        it('should return bounding box', () => {
            const boundingBox = asteroid.getBoundingBox();
            
            expect(boundingBox).toBeInstanceOf(THREE.Box3);
            expect(boundingBox.min).toBeDefined();
            expect(boundingBox.max).toBeDefined();
        });
    });

    describe('Resource Management', () => {
        it('should dispose of resources properly', () => {
            const geometryDisposeSpy = vi.spyOn(asteroid.mesh.geometry, 'dispose');
            const materialDisposeSpy = vi.spyOn(asteroid.mesh.material, 'dispose');
            
            asteroid.destroy();
            
            expect(geometryDisposeSpy).toHaveBeenCalled();
            expect(materialDisposeSpy).toHaveBeenCalled();
        });

        it('should handle destroy when mesh is null', () => {
            asteroid.mesh = null;
            
            expect(() => asteroid.destroy()).not.toThrow();
        });
    });

    describe('Size Variations', () => {
        it('should have different sizes for different instances', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const asteroid2 = new Asteroid();
            
            // Get the radius from the geometry
            const radius1 = asteroid1.mesh.geometry.parameters.radius;
            const radius2 = asteroid2.mesh.geometry.parameters.radius;
            
            // With randomness, sizes should likely be different
            expect(radius1).not.toBe(radius2);
        });

        it('should have size within expected range', () => {
            vi.restoreAllMocks();
            const asteroid1 = new Asteroid();
            const radius = asteroid1.mesh.geometry.parameters.radius;
            
            expect(radius).toBeGreaterThanOrEqual(0.3);
            expect(radius).toBeLessThanOrEqual(0.8);
        });
    });
});