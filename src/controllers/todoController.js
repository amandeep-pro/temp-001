const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// Get all todos
const getAllTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    const todos = await prisma.todo.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.todo.count({ where });

    res.json({
      data: todos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get todo by ID
const getTodoById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// Create new todo
const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        description
      }
    });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// Update todo
const updateTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed })
      }
    });

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// Delete todo
const deleteTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Mark todo as completed
const completeTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { completed: true }
    });

    res.json(todo);
  } catch (error) {
    next(error);
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