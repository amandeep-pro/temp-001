const express = require('express');
const { body, param } = require('express-validator');
const { 
  getAllTodos, 
  getTodoById, 
  createTodo, 
  updateTodo, 
  completeTodo, 
  deleteTodo 
} = require('../controllers/todoController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Validation middleware
const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
];

const updateTodoValidation = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

// Routes
router.get('/', getAllTodos);
router.get('/:id', idValidation, getTodoById);
router.post('/', createTodoValidation, createTodo);
router.put('/:id', idValidation, updateTodoValidation, updateTodo);
router.patch('/:id/complete', idValidation, completeTodo);
router.delete('/:id', idValidation, deleteTodo);

module.exports = router;