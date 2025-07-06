const { body, param, query } = require('express-validator');

// Validation for creating a todo
const validateCreateTodo = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
];

// Validation for updating a todo
const validateUpdateTodo = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Todo ID must be a positive integer'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

// Validation for getting a todo by ID
const validateGetTodoById = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Todo ID must be a positive integer')
];

// Validation for deleting a todo
const validateDeleteTodo = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Todo ID must be a positive integer')
];

// Validation for getting all todos with query parameters
const validateGetAllTodos = [
  query('page')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('completed')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Completed must be true or false')
];

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateGetTodoById,
  validateDeleteTodo,
  validateGetAllTodos
};