# Asteroid Dodge - 3D Browser Game

A browser-based 3D mini-game built with Three.js where players control a spaceship to dodge falling asteroids.

## Features

- **3D Graphics**: Built with Three.js for smooth 3D rendering
- **Progressive Difficulty**: Asteroid spawn rate and speed increase over time
- **Responsive Controls**: Use arrow keys or WASD to move your spaceship
- **Score System**: Score increases based on survival time
- **Game Over & Restart**: Full game state management with restart functionality
- **Modern UI**: Clean, responsive design with real-time score display

## Technical Stack

- **Runtime**: Node.js v22+
- **Framework**: Three.js (3D graphics)
- **Build Tool**: Vite (fast development and production builds)
- **Testing**: Vitest with comprehensive test coverage
- **Language**: Modern JavaScript (ES2022)

## Project Structure

```
asteroid-dodge/
├── src/
│   ├── Game.js         # Main game logic and state management
│   ├── Spaceship.js    # Player spaceship class
│   ├── Asteroid.js     # Asteroid physics and rendering
│   ├── Utils.js        # Utility functions (collision detection, etc.)
│   └── index.js        # Game initialization
├── tests/
│   ├── Game.test.js    # Game mechanics tests
│   ├── Spaceship.test.js # Spaceship behavior tests
│   ├── Asteroid.test.js  # Asteroid physics tests
│   ├── Utils.test.js     # Utility functions tests
│   └── setup.js          # Test environment setup
├── assets/             # Game assets (currently empty)
├── public/             # Public assets (currently empty)
├── dist/              # Production build output
├── index.html         # Main HTML file
├── package.json       # Dependencies and scripts
├── vite.config.js     # Build configuration
└── README.md          # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asteroid-dodge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify Node.js version**
   ```bash
   node --version  # Should be v22 or higher
   ```

## Development

### Start Development Server
```bash
npm run dev
```
- Starts Vite development server
- Opens at `http://localhost:3000`
- Features hot-reloading for rapid development

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Build for Production
```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- Minifies JavaScript and CSS
- Optimizes assets for production

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Test production build before deployment

## Game Controls

- **Arrow Keys** or **WASD**: Move spaceship left/right
- **Mouse**: Not used (keyboard-only game)
- **Spacebar**: Not used
- **Escape**: Not used

## How to Play

1. **Objective**: Survive as long as possible by dodging falling asteroids
2. **Movement**: Use left/right arrow keys to move your green spaceship
3. **Scoring**: Your score increases automatically based on survival time
4. **Difficulty**: Asteroid spawn rate and speed increase over time
5. **Game Over**: When your spaceship collides with an asteroid
6. **Restart**: Click the "Restart Game" button to play again

## Game Features

### Progressive Difficulty
- Asteroid spawn interval decreases over time (more frequent spawns)
- Game speed increases gradually
- Asteroid movement speed multiplier increases

### Visual Effects
- Randomly generated asteroid shapes and colors
- Spaceship with glowing effect
- Starfield background
- Smooth 3D rotations and movements
- Professional lighting and shadows

### Game Mechanics
- Precise bounding box collision detection
- Boundary constraints for spaceship movement
- Automatic asteroid cleanup when off-screen
- Smooth game state transitions

## Testing

The game includes comprehensive test coverage:

- **Game Mechanics**: Spaceship movement, asteroid spawning, collision detection
- **Score System**: Time-based scoring, score display updates
- **Game State**: Game over conditions, restart functionality
- **Difficulty Scaling**: Progressive difficulty increases
- **Event Handling**: Keyboard input, button clicks
- **Resource Management**: Proper cleanup of 3D objects

### Test Coverage Areas

1. **Spaceship Tests**: Movement controls, boundary constraints, visual feedback
2. **Asteroid Tests**: Physics simulation, random generation, collision bounds
3. **Game Tests**: Core game loop, state management, event handling
4. **Utils Tests**: Collision detection, mathematical utilities, helper functions

## Performance

- **Optimized Rendering**: Uses Three.js WebGL renderer
- **Efficient Collision Detection**: Bounding box algorithms
- **Memory Management**: Proper cleanup of 3D objects
- **Smooth 60 FPS**: Optimized animation loop

## Browser Compatibility

- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

Requires WebGL support for 3D graphics.

## Production Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server
   - Can be hosted on any static hosting service
   - No server-side requirements
   - Works with GitHub Pages, Netlify, Vercel, etc.

3. **Configure web server** (if needed)
   - Ensure proper MIME types for `.js` and `.css` files
   - Enable gzip compression for better performance

## Development Notes

### Code Quality
- Modern ES2022 JavaScript
- Modular architecture with clear separation of concerns
- Comprehensive error handling
- Proper resource management

### Performance Optimization
- Efficient object pooling for asteroids
- Optimized collision detection
- Smooth 60 FPS rendering
- Memory leak prevention

### Testing Strategy
- Unit tests for all game components
- Integration tests for game flow
- Headless rendering tests
- Mock-based testing for WebGL

## Troubleshooting

### Common Issues

1. **White screen on load**
   - Check browser console for errors
   - Ensure WebGL is supported
   - Try a different browser

2. **Poor performance**
   - Close other browser tabs
   - Update graphics drivers
   - Use Chrome for best performance

3. **Tests failing**
   - Ensure Node.js v22+ is installed
   - Run `npm install` to update dependencies
   - Check for any console errors

### Debug Mode
Enable debug mode by opening browser developer tools (F12) and checking the console for game state information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Build project: `npm run build`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Game Design Credits

- **Concept**: Classic arcade-style asteroid avoidance game
- **Graphics**: Three.js 3D rendering engine
- **Physics**: Custom collision detection and movement systems
- **UI/UX**: Modern minimalist design with responsive controls