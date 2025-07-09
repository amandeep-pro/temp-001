import { vi } from 'vitest';

// Mock HTMLCanvasElement and WebGL context
global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
}));

// Mock WebGL context
const mockWebGLContext = {
    canvas: document.createElement('canvas'),
    drawingBufferWidth: 800,
    drawingBufferHeight: 600,
    getExtension: vi.fn((name) => {
        if (name === 'WEBGL_debug_renderer_info') return {};
        if (name === 'EXT_texture_filter_anisotropic') return {};
        if (name === 'WEBGL_compressed_texture_s3tc') return {};
        if (name === 'WEBGL_compressed_texture_pvrtc') return {};
        if (name === 'WEBGL_compressed_texture_etc1') return {};
        return null;
    }),
    getParameter: vi.fn((param) => {
        if (param === 0x1F00) return 'WebGL Mock'; // VENDOR
        if (param === 0x1F01) return 'WebGL Mock Renderer'; // RENDERER
        if (param === 0x1F02) return 'WebGL 1.0'; // VERSION
        if (param === 0x8B8C) return 'WebGL GLSL ES 1.0'; // SHADING_LANGUAGE_VERSION
        if (param === 0x0D33) return 16; // MAX_TEXTURE_SIZE
        if (param === 0x8872) return 8; // MAX_VERTEX_TEXTURE_IMAGE_UNITS
        if (param === 0x8B4D) return 32; // MAX_FRAGMENT_UNIFORM_VECTORS
        if (param === 0x8B4C) return 128; // MAX_VERTEX_UNIFORM_VECTORS
        if (param === 0x8B4B) return 8; // MAX_VARYING_VECTORS
        if (param === 0x34047) return 4; // MAX_TEXTURE_MAX_ANISOTROPY_EXT
        return 0;
    }),
    createShader: vi.fn(() => ({ id: 'mockShader' })),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(() => ({ id: 'mockProgram' })),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    useProgram: vi.fn(),
    createBuffer: vi.fn(() => ({ id: 'mockBuffer' })),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    uniformMatrix4fv: vi.fn(),
    getUniformLocation: vi.fn(() => ({ id: 'mockLocation' })),
    getAttribLocation: vi.fn(() => 0),
    drawArrays: vi.fn(),
    drawElements: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    blendFunc: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    clearDepth: vi.fn(),
    depthFunc: vi.fn(),
    frontFace: vi.fn(),
    cullFace: vi.fn(),
    viewport: vi.fn(),
    createTexture: vi.fn(() => ({ id: 'mockTexture' })),
    bindTexture: vi.fn(),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
    generateMipmap: vi.fn(),
    createFramebuffer: vi.fn(() => ({ id: 'mockFramebuffer' })),
    bindFramebuffer: vi.fn(),
    framebufferTexture2D: vi.fn(),
    checkFramebufferStatus: vi.fn(() => 0x8CD5), // FRAMEBUFFER_COMPLETE
    deleteBuffer: vi.fn(),
    deleteFramebuffer: vi.fn(),
    deleteProgram: vi.fn(),
    deleteShader: vi.fn(),
    deleteTexture: vi.fn(),
    isBuffer: vi.fn(() => true),
    isEnabled: vi.fn(() => false),
    isFramebuffer: vi.fn(() => true),
    isProgram: vi.fn(() => true),
    isShader: vi.fn(() => true),
    isTexture: vi.fn(() => true),
    pixelStorei: vi.fn(),
    readPixels: vi.fn(),
    // Constants
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    STATIC_DRAW: 0x88E4,
    TRIANGLES: 0x0004
};

global.WebGLRenderingContext = vi.fn(() => mockWebGLContext);

// Mock WebGL2 context
global.WebGL2RenderingContext = global.WebGLRenderingContext;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
    setTimeout(callback, 16);
    return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 800,
});

Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 600,
});

// Mock performance.now
global.performance = {
    now: vi.fn(() => Date.now())
};

// Mock localStorage
global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

// Mock audio context
global.AudioContext = vi.fn(() => ({
    createOscillator: vi.fn(),
    createGain: vi.fn(),
    destination: {},
    currentTime: 0,
    sampleRate: 44100,
    resume: vi.fn(),
    suspend: vi.fn(),
    close: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Suppress console warnings in tests
global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
};