const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// Get all todos
const getAllTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const completed = req.query.completed;

    const where = {
      userId: req.user.id
    };

    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.todo.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: todos,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get todo by ID
const getTodoById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const todoId = parseInt(id);

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new todo
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update todo
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const todoId = parseInt(id);
    const { title, description, completed } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id
      }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const todoId = parseInt(id);

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id
      }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id: todoId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark todo as completed
const completeTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const todoId = parseInt(id);

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id
      }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(todo);
  } catch (error) {
    console.error('Complete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo
};