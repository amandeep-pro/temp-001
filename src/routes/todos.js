const express = require('express');
const router = express.Router();

const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo
} = require('../controllers/todoController');

const {
  validateCreateTodo,
  validateUpdateTodo,
  validateGetTodoById,
  validateDeleteTodo,
  validateGetAllTodos
} = require('../middleware/validation');

// GET /api/todos - Get all todos with pagination and filtering
router.get('/', validateGetAllTodos, getAllTodos);

// GET /api/todos/:id - Get todo by ID
router.get('/:id', validateGetTodoById, getTodoById);

// POST /api/todos - Create new todo
router.post('/', validateCreateTodo, createTodo);

// PUT /api/todos/:id - Update todo
router.put('/:id', validateUpdateTodo, updateTodo);

// PATCH /api/todos/:id/complete - Mark todo as completed
router.patch('/:id/complete', validateGetTodoById, completeTodo);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', validateDeleteTodo, deleteTodo);

module.exports = router;