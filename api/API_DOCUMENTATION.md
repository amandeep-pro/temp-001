# TODO API Documentation

A RESTful API for managing todos built with Node.js 22, Express, SQLite, and Prisma ORM.

## Features

- ✅ Complete CRUD operations for todos
- ✅ Input validation and error handling
- ✅ Pagination and filtering
- ✅ SQLite database with Prisma ORM
- ✅ Comprehensive E2E tests (19 tests, 100% passing)
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging with Morgan
- ✅ Health check endpoint

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run setup
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Run tests:**
   ```bash
   npm run test:e2e
   ```

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns server health status and uptime

### Todos

#### Get All Todos
- **GET** `/api/todos`
- **Query Parameters:**
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `completed` (optional): Filter by completion status (`true` or `false`)
- **Response:** Paginated list of todos with pagination metadata

#### Get Todo by ID
- **GET** `/api/todos/:id`
- **Parameters:**
  - `id`: Todo ID (positive integer)
- **Response:** Single todo object

#### Create Todo
- **POST** `/api/todos`
- **Body:**
  ```json
  {
    "title": "string (required, 1-255 chars)",
    "description": "string (optional, max 1000 chars)"
  }
  ```
- **Response:** Created todo object

#### Update Todo
- **PUT** `/api/todos/:id`
- **Parameters:**
  - `id`: Todo ID (positive integer)
- **Body:**
  ```json
  {
    "title": "string (optional, 1-255 chars)",
    "description": "string (optional, max 1000 chars)",
    "completed": "boolean (optional)"
  }
  ```
- **Response:** Updated todo object

#### Mark Todo as Complete
- **PATCH** `/api/todos/:id/complete`
- **Parameters:**
  - `id`: Todo ID (positive integer)
- **Response:** Updated todo object with completed: true

#### Delete Todo
- **DELETE** `/api/todos/:id`
- **Parameters:**
  - `id`: Todo ID (positive integer)
- **Response:** 204 No Content

## Todo Schema

```json
{
  "id": "integer (auto-generated)",
  "title": "string (required)",
  "description": "string (optional)",
  "completed": "boolean (default: false)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "errors": ["Validation error details..."] // Only for validation errors
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
NODE_ENV=development
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with auto-reload
- `npm run test:e2e`: Run end-to-end tests
- `npm run setup`: Generate Prisma client and setup database
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:push`: Push database schema
- `npm run prisma:studio`: Open Prisma Studio

## Project Structure

```
├── src/
│   ├── controllers/
│   │   └── todoController.js     # Todo business logic
│   ├── middleware/
│   │   ├── errorHandler.js       # Error handling middleware
│   │   └── validation.js         # Input validation rules
│   ├── routes/
│   │   └── todos.js              # Todo routes
│   └── index.js                  # Main application entry point
├── tests/
│   └── e2e/
│       ├── setup.js              # Test setup and teardown
│       ├── teardown.js           # Test cleanup
│       └── todos.test.js         # E2E tests (19 tests)
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variables template
└── API_DOCUMENTATION.md          # This file
```

## Example Usage

```bash
# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Complete the Node.js tutorial"}'

# Get all todos
curl http://localhost:3000/api/todos

# Get todos with pagination
curl http://localhost:3000/api/todos?page=1&limit=5

# Get completed todos only
curl http://localhost:3000/api/todos?completed=true

# Get a specific todo
curl http://localhost:3000/api/todos/1

# Update a todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","completed":true}'

# Mark todo as complete
curl -X PATCH http://localhost:3000/api/todos/1/complete

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/1
```

## Testing

The API includes comprehensive E2E tests covering:
- ✅ Health check endpoint
- ✅ Todo creation (with and without description)
- ✅ Input validation (invalid data, missing fields)
- ✅ Todo retrieval (all todos, pagination, filtering)
- ✅ Todo updates (full and partial updates)
- ✅ Todo completion marking
- ✅ Todo deletion
- ✅ Error handling (404, 400 errors)
- ✅ Complete CRUD integration test

All tests use a separate test database and clean up after each test run.

## Dependencies

### Production Dependencies
- `express`: Web framework
- `@prisma/client`: Database ORM client
- `cors`: Cross-origin resource sharing
- `helmet`: Security middleware
- `morgan`: HTTP request logger
- `dotenv`: Environment variable loader
- `express-validator`: Input validation

### Development Dependencies
- `prisma`: Database toolkit
- `nodemon`: Development server with auto-reload
- `jest`: Testing framework
- `supertest`: HTTP testing library

## Requirements Met

✅ **Node.js 22**: Using Node.js 22 with appropriate engine specification
✅ **SQLite Database**: Using SQLite with Prisma ORM
✅ **TODO API**: Complete CRUD operations for todos
✅ **E2E Tests**: Comprehensive end-to-end testing suite
✅ **Validation**: Input validation and error handling
✅ **Security**: Security middleware and best practices
✅ **Documentation**: Complete API documentation