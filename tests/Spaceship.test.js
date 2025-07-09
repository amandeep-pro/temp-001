import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Spaceship } from '../src/Spaceship.js';
import * as THREE from 'three';

describe('Spaceship', () => {
    let spaceship;

    beforeEach(() => {
        spaceship = new Spaceship();
    });

    describe('Initialization', () => {
        it('should create a spaceship instance', () => {
            expect(spaceship).toBeDefined();
            expect(spaceship.mesh).toBeDefined();
            expect(spaceship.speed).toBe(0.3);
            expect(spaceship.bounds).toBe(8);
        });

        it('should position spaceship correctly', () => {
            expect(spaceship.mesh.position.x).toBe(0);
            expect(spaceship.mesh.position.y).toBe(-5);
            expect(spaceship.mesh.position.z).toBe(0);
        });

        it('should orient spaceship upward', () => {
            expect(spaceship.mesh.rotation.x).toBe(Math.PI);
        });

        it('should have correct mesh geometry', () => {
            expect(spaceship.mesh.geometry).toBeInstanceOf(THREE.ConeGeometry);
            expect(spaceship.mesh.material).toBeInstanceOf(THREE.MeshLambertMaterial);
        });
    });

    describe('Movement Controls', () => {
        it('should move left when ArrowLeft is pressed', () => {
            const initialX = spaceship.mesh.position.x;
            const keys = { 'ArrowLeft': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBeLessThan(initialX);
        });

        it('should move right when ArrowRight is pressed', () => {
            const initialX = spaceship.mesh.position.x;
            const keys = { 'ArrowRight': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBeGreaterThan(initialX);
        });

        it('should support WASD controls', () => {
            const initialX = spaceship.mesh.position.x;
            let keys = { 'KeyA': true };
            
            spaceship.update(keys);
            expect(spaceship.mesh.position.x).toBeLessThan(initialX);
            
            spaceship.reset();
            keys = { 'KeyD': true };
            
            spaceship.update(keys);
            expect(spaceship.mesh.position.x).toBeGreaterThan(initialX);
        });

        it('should not move when no keys are pressed', () => {
            const initialX = spaceship.mesh.position.x;
            const keys = {};
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(initialX);
        });

        it('should move at correct speed', () => {
            const initialX = spaceship.mesh.position.x;
            const keys = { 'ArrowLeft': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(initialX - spaceship.speed);
        });
    });

    describe('Boundary Constraints', () => {
        it('should stay within left boundary', () => {
            spaceship.mesh.position.x = -spaceship.bounds - 1;
            const keys = { 'ArrowLeft': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(-spaceship.bounds);
        });

        it('should stay within right boundary', () => {
            spaceship.mesh.position.x = spaceship.bounds + 1;
            const keys = { 'ArrowRight': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(spaceship.bounds);
        });

        it('should allow movement within bounds', () => {
            spaceship.mesh.position.x = 0;
            const keys = { 'ArrowLeft': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(-spaceship.speed);
            expect(spaceship.mesh.position.x).toBeGreaterThan(-spaceship.bounds);
        });

        it('should clamp position to exact boundaries', () => {
            spaceship.mesh.position.x = -20; // Far beyond left boundary
            const keys = {};
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.position.x).toBe(-spaceship.bounds);
        });
    });

    describe('Visual Feedback', () => {
        it('should rotate when moving left', () => {
            const initialRotation = spaceship.mesh.rotation.z;
            const keys = { 'ArrowLeft': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.rotation.z).toBeGreaterThan(initialRotation);
        });

        it('should rotate when moving right', () => {
            const initialRotation = spaceship.mesh.rotation.z;
            const keys = { 'ArrowRight': true };
            
            spaceship.update(keys);
            
            expect(spaceship.mesh.rotation.z).toBeLessThan(initialRotation);
        });

        it('should limit rotation angle', () => {
            const keys = { 'ArrowLeft': true };
            
            // Update multiple times to test rotation limit
            for (let i = 0; i < 10; i++) {
                spaceship.update(keys);
            }
            
            expect(spaceship.mesh.rotation.z).toBeLessThanOrEqual(0.3);
        });

        it('should return to center rotation when no input', () => {
            // First rotate the ship
            spaceship.mesh.rotation.z = 0.3;
            const keys = {};
            
            spaceship.update(keys);
            
            expect(Math.abs(spaceship.mesh.rotation.z)).toBeLessThan(0.3);
        });
    });

    describe('Reset Functionality', () => {
        it('should reset position to center', () => {
            spaceship.mesh.position.x = 5;
            spaceship.mesh.position.y = 0;
            spaceship.mesh.rotation.z = 0.5;
            
            spaceship.reset();
            
            expect(spaceship.mesh.position.x).toBe(0);
            expect(spaceship.mesh.position.y).toBe(-5);
            expect(spaceship.mesh.position.z).toBe(0);
            expect(spaceship.mesh.rotation.x).toBe(Math.PI);
            expect(spaceship.mesh.rotation.z).toBe(0);
        });
    });

    describe('Helper Methods', () => {
        it('should return correct position', () => {
            spaceship.mesh.position.set(1, 2, 3);
            const position = spaceship.getPosition();
            
            expect(position.x).toBe(1);
            expect(position.y).toBe(2);
            expect(position.z).toBe(3);
        });

        it('should return position as a clone', () => {
            const position = spaceship.getPosition();
            position.x = 100;
            
            expect(spaceship.mesh.position.x).not.toBe(100);
        });

        it('should return bounding box', () => {
            const boundingBox = spaceship.getBoundingBox();
            
            expect(boundingBox).toBeInstanceOf(THREE.Box3);
            expect(boundingBox.min).toBeDefined();
            expect(boundingBox.max).toBeDefined();
        });
    });

    describe('Mesh Properties', () => {
        it('should have shadow properties enabled', () => {
            expect(spaceship.mesh.castShadow).toBe(true);
            expect(spaceship.mesh.receiveShadow).toBe(true);
        });

        it('should have correct material color', () => {
            expect(spaceship.mesh.material.color.getHex()).toBe(0x00ff00);
        });

        it('should have a glow effect child', () => {
            expect(spaceship.mesh.children.length).toBe(1);
            const glow = spaceship.mesh.children[0];
            expect(glow.material.transparent).toBe(true);
            expect(glow.material.opacity).toBe(0.3);
        });
    });
});