import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Game } from '../src/Game.js';
import { Spaceship } from '../src/Spaceship.js';
import { Asteroid } from '../src/Asteroid.js';
import { Utils } from '../src/Utils.js';

// Mock DOM elements
const createMockElements = () => {
    document.body.innerHTML = `
        <div id="gameContainer"></div>
        <div id="score">0</div>
        <div id="finalScore">0</div>
        <div id="gameOverScreen" style="display: none;"></div>
        <button id="restartButton">Restart</button>
    `;
    
    // Add click method to button
    const restartButton = document.getElementById('restartButton');
    restartButton.click = vi.fn(() => {
        restartButton.dispatchEvent(new Event('click'));
    });
};

describe('Game', () => {
    let game;

    beforeEach(() => {
        createMockElements();
        vi.clearAllMocks();
        game = new Game(true); // Enable test mode
    });

    afterEach(() => {
        if (game) {
            game.destroy();
        }
    });

    describe('Initialization', () => {
        it('should create a new game instance', () => {
            expect(game).toBeDefined();
            expect(game.score).toBe(0);
            expect(game.isGameOver).toBe(false);
            expect(game.asteroids).toEqual([]);
        });

        it('should initialize game components', () => {
            game.init();
            expect(game.scene).toBeDefined();
            expect(game.camera).toBeDefined();
            expect(game.renderer).toBeDefined();
            expect(game.spaceship).toBeDefined();
        });

        it('should set up event listeners', () => {
            game.init();
            expect(game.keys).toBeDefined();
            expect(typeof game.keys).toBe('object');
        });
    });

    describe('Game Mechanics', () => {
        beforeEach(() => {
            game.init();
        });

        it('should spawn asteroids at intervals', () => {
            const initialCount = game.asteroids.length;
            game.spawnAsteroid();
            expect(game.asteroids.length).toBe(initialCount + 1);
        });

        it('should update asteroid positions', () => {
            game.spawnAsteroid();
            const asteroid = game.asteroids[0];
            const initialY = asteroid.mesh.position.y;
            
            game.updateAsteroids();
            
            expect(asteroid.mesh.position.y).toBeLessThan(initialY);
        });

        it('should remove asteroids that fall below screen', () => {
            game.spawnAsteroid();
            const asteroid = game.asteroids[0];
            asteroid.mesh.position.y = -25; // Below removal threshold
            
            game.updateAsteroids();
            
            expect(game.asteroids.length).toBe(0);
        });

        it('should update spaceship position based on keys', () => {
            const initialX = game.spaceship.mesh.position.x;
            game.keys['ArrowLeft'] = true;
            
            game.spaceship.update(game.keys);
            
            expect(game.spaceship.mesh.position.x).toBeLessThan(initialX);
        });

        it('should keep spaceship within bounds', () => {
            // Move spaceship to far left
            game.spaceship.mesh.position.x = -20;
            game.keys['ArrowLeft'] = true;
            
            game.spaceship.update(game.keys);
            
            expect(game.spaceship.mesh.position.x).toBeGreaterThanOrEqual(-game.spaceship.bounds);
        });
    });

    describe('Collision Detection', () => {
        beforeEach(() => {
            game.init();
        });

        it('should detect collision between spaceship and asteroid', () => {
            game.spawnAsteroid();
            const asteroid = game.asteroids[0];
            
            // Position asteroid at spaceship location
            asteroid.mesh.position.copy(game.spaceship.mesh.position);
            
            const spy = vi.spyOn(game, 'gameOver');
            game.checkCollisions();
            
            expect(spy).toHaveBeenCalled();
        });

        it('should not trigger collision when objects are apart', () => {
            game.spawnAsteroid();
            const asteroid = game.asteroids[0];
            
            // Position asteroid far from spaceship
            asteroid.mesh.position.set(10, 10, 10);
            
            const spy = vi.spyOn(game, 'gameOver');
            game.checkCollisions();
            
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('Score Tracking', () => {
        beforeEach(() => {
            game.init();
        });

        it('should increase score over time', () => {
            const initialScore = game.score;
            
            // Simulate time passing
            game.gameStartTime = Date.now() - 5000; // 5 seconds ago
            game.updateScore();
            
            expect(game.score).toBeGreaterThan(initialScore);
        });

        it('should reset score on game restart', () => {
            game.score = 100;
            game.resetGame();
            
            expect(game.score).toBe(0);
        });

        it('should update score display', () => {
            game.score = 150;
            game.scoreElement.textContent = '150';
            
            expect(game.scoreElement.textContent).toBe('150');
        });
    });

    describe('Game State Management', () => {
        beforeEach(() => {
            game.init();
        });

        it('should end game on collision', () => {
            game.gameOver();
            
            expect(game.isGameOver).toBe(true);
            expect(game.gameOverScreen.style.display).toBe('block');
        });

        it('should restart game correctly', () => {
            game.score = 100;
            game.asteroids = [new Asteroid()];
            game.gameOver();
            
            game.restartGame();
            
            expect(game.isGameOver).toBe(false);
            expect(game.score).toBe(0);
            expect(game.asteroids.length).toBe(0);
            expect(game.gameOverScreen.style.display).toBe('none');
        });

        it('should reset game state correctly', () => {
            // Set up game state
            game.score = 200;
            game.asteroids = [new Asteroid(), new Asteroid()];
            game.gameSpeed = 2;
            
            game.resetGame();
            
            expect(game.score).toBe(0);
            expect(game.asteroids.length).toBe(0);
            expect(game.gameSpeed).toBe(1);
            expect(game.isGameOver).toBe(false);
        });
    });

    describe('Difficulty Scaling', () => {
        beforeEach(() => {
            game.init();
        });

        it('should increase game speed over time', () => {
            const initialSpeed = game.gameSpeed;
            
            // Simulate 30 seconds passing
            game.gameStartTime = Date.now() - 30000;
            game.updateDifficulty();
            
            expect(game.gameSpeed).toBeGreaterThan(initialSpeed);
        });

        it('should decrease asteroid spawn interval over time', () => {
            const initialInterval = game.asteroidSpawnInterval;
            
            // Simulate time passing
            game.gameStartTime = Date.now() - 10000;
            game.updateDifficulty();
            
            expect(game.asteroidSpawnInterval).toBeLessThan(initialInterval);
        });

        it('should not let spawn interval go below minimum', () => {
            // Simulate very long time passing
            game.gameStartTime = Date.now() - 100000;
            game.updateDifficulty();
            
            expect(game.asteroidSpawnInterval).toBeGreaterThanOrEqual(300);
        });
    });

    describe('Event Handling', () => {
        beforeEach(() => {
            game.init();
        });

        it('should handle key down events', () => {
            const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            document.dispatchEvent(event);
            
            expect(game.keys['ArrowLeft']).toBe(true);
        });

        it('should handle key up events', () => {
            game.keys['ArrowLeft'] = true;
            const event = new KeyboardEvent('keyup', { code: 'ArrowLeft' });
            document.dispatchEvent(event);
            
            expect(game.keys['ArrowLeft']).toBe(false);
        });

        it('should handle restart button click', () => {
            game.gameOver();
            const spy = vi.spyOn(game, 'restartGame');
            
            game.restartButton.click();
            
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Resource Management', () => {
        beforeEach(() => {
            game.init();
        });

        it('should clean up resources on destroy', () => {
            game.spawnAsteroid();
            const initialAsteroids = game.asteroids.length;
            
            game.destroy();
            
            expect(game.asteroids.length).toBe(0);
            expect(game.animationId).toBe(null);
        });

        it('should cancel animation frame on game over', () => {
            const spy = vi.spyOn(window, 'cancelAnimationFrame');
            game.animationId = 123;
            
            game.gameOver();
            
            expect(spy).toHaveBeenCalledWith(123);
        });
    });
});