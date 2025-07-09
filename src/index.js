import { Game } from './Game.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
    
    // Make game globally accessible for testing
    window.game = game;
});

// Handle page visibility changes (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Game is paused when tab is not visible
        console.log('Game paused');
    } else {
        // Game resumes when tab becomes visible
        console.log('Game resumed');
    }
});

// Handle unload to clean up resources
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.destroy();
    }
});