const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { app } = require('../../src/index');

describe('Todo API E2E Tests', () => {
  let server;
  let testUser;
  let authToken;

  beforeAll(async () => {
    server = require('../../src/index').server;
    
    // Create a test user and get auth token
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    testUser = await global.prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpass123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBe(todoData.description);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.userId).toBe(testUser.id);
    });

    it('should create a todo without description', async () => {
      const todoData = {
        title: 'Test Todo without description'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBeNull();
      expect(response.body.completed).toBe(false);
    });

    it('should return 401 without auth token', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo'
      };

      await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(401);
    });

    it('should return 400 for invalid todo data', async () => {
      const invalidTodoData = {
        title: '', // Empty title
        description: 'Test description'
      };

      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodoData)
        .expect(400);
    });

    it('should return 400 for missing title', async () => {
      const invalidTodoData = {
        description: 'Test description'
      };

      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodoData)
        .expect(400);
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      // Create test todos for the test user
      await global.prisma.todo.createMany({
        data: [
          {
            title: 'Todo 1',
            description: 'First todo',
            completed: false,
            userId: testUser.id
          },
          {
            title: 'Todo 2',
            description: 'Second todo',
            completed: true,
            userId: testUser.id
          },
          {
            title: 'Todo 3',
            description: 'Third todo',
            completed: false,
            userId: testUser.id
          }
        ]
      });
    });

    it('should get all todos with pagination', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(3);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should filter todos by completion status', async () => {
      const response = await request(app)
        .get('/api/todos?completed=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      response.body.data.forEach(todo => {
        expect(todo.completed).toBe(true);
      });
    });

    it('should paginate todos', async () => {
      const response = await request(app)
        .get('/api/todos?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await global.prisma.todo.create({
        data: {
          title: 'Test Todo',
          description: 'Test description',
          completed: false,
          userId: testUser.id
        }
      });
      todoId = todo.id;
    });

    it('should get a todo by ID', async () => {
      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.description).toBe('Test description');
      expect(response.body.completed).toBe(false);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .get('/api/todos/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .get('/api/todos/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await global.prisma.todo.create({
        data: {
          title: 'Test Todo',
          description: 'Test description',
          completed: false,
          userId: testUser.id
        }
      });
      todoId = todo.id;
    });

    it('should update a todo', async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.completed).toBe(updateData.completed);
    });

    it('should partially update a todo', async () => {
      const updateData = {
        title: 'Updated Title Only'
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe('Test description'); // Unchanged
      expect(response.body.completed).toBe(false); // Unchanged
    });

    it('should return 404 for non-existent todo', async () => {
      const updateData = {
        title: 'Updated Todo'
      };

      await request(app)
        .put('/api/todos/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await global.prisma.todo.create({
        data: {
          title: 'Test Todo',
          description: 'Test description',
          completed: false,
          userId: testUser.id
        }
      });
      todoId = todo.id;
    });

    it('should mark a todo as completed', async () => {
      const response = await request(app)
        .patch(`/api/todos/${todoId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .patch('/api/todos/999/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await global.prisma.todo.create({
        data: {
          title: 'Test Todo',
          description: 'Test description',
          completed: false,
          userId: testUser.id
        }
      });
      todoId = todo.id;
    });

    it('should delete a todo', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify todo is deleted
      const todo = await global.prisma.todo.findUnique({
        where: { id: todoId }
      });
      expect(todo).toBeNull();
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .delete('/api/todos/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Integration Tests', () => {
    it('should create, read, update, and delete a todo', async () => {
      // Create
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Todo',
          description: 'Test description'
        })
        .expect(201);

      const todoId = createResponse.body.id;

      // Read
      const readResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(readResponse.body.title).toBe('Integration Test Todo');

      // Update
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Integration Test Todo',
          completed: true
        })
        .expect(200);

      expect(updateResponse.body.title).toBe('Updated Integration Test Todo');
      expect(updateResponse.body.completed).toBe(true);

      // Delete
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});