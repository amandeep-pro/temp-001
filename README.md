# Todo Full Stack Application

A modern full-stack todo application built with Node.js API and NextJS frontend, featuring user authentication, responsive design, and comprehensive end-to-end testing.

## Project Structure

```
.
├── context.xml              # Project configuration and tracking
├── api/                     # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Authentication & validation middleware
│   │   ├── routes/          # API routes
│   │   └── index.js         # API entry point
│   ├── prisma/              # Database schema
│   ├── tests/               # API tests (Jest + Supertest)
│   └── package.json
├── web/                     # NextJS Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components (shadcn/ui)
│   │   ├── contexts/        # React contexts
│   │   └── lib/             # Utilities and API client
│   ├── tests/               # Frontend tests (Playwright)
│   └── package.json
└── package.json             # Root package.json with scripts
```

## Features

### Backend (API)
- **Authentication**: JWT-based authentication with user registration/login
- **Database**: SQLite with Prisma ORM
- **Todo Management**: CRUD operations with user isolation
- **Testing**: Comprehensive e2e tests with Jest + Supertest
- **Validation**: Request validation with express-validator
- **Security**: CORS, Helmet, bcrypt password hashing

### Frontend (Web)
- **Framework**: NextJS 14 with TypeScript and App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Context-based auth management
- **Responsive Design**: Mobile-first responsive layout
- **Testing**: End-to-end tests with Playwright
- **Forms**: React Hook Form with Zod validation

## Quick Start

### Prerequisites
- Node.js >= 22.0.0
- npm

### Installation & Setup

1. **Clone and setup:**
   ```bash
   npm run setup
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This starts both API (port 3001) and Web (port 3000) servers.

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - API Health: http://localhost:3001/health

## Running Tests

### All Tests
```bash
npm run test
```

### API Tests Only
```bash
npm run test:api
```

### Web Tests Only
```bash
npm run test:web
```

### Integration Tests (API + Web together)
```bash
npm run test:all
```

### Web Tests with Browser UI
```bash
npm run web:test:headed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)

### Todos
All todo endpoints require authentication (Bearer token).

- `GET /api/todos` - Get user's todos (with pagination)
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/complete` - Mark todo as completed
- `DELETE /api/todos/:id` - Delete todo

### Health Check
- `GET /health` - API health status

## Development Scripts

### Root Level
- `npm run setup` - Install dependencies and setup database
- `npm run dev` - Start both API and web in development
- `npm run test` - Run all tests
- `npm run test:all` - Run integration tests
- `npm run build` - Build web application
- `npm run start` - Start production servers

### API (from /api directory)
- `npm run dev` - Start API development server
- `npm run test:e2e` - Run API end-to-end tests
- `npm run setup` - Generate Prisma client and push schema
- `npm run prisma:studio` - Open Prisma Studio

### Web (from /web directory)
- `npm run dev` - Start web development server
- `npm run test` - Run Playwright tests
- `npm run test:ui` - Run Playwright tests with UI
- `npm run build` - Build for production

## Architecture

### Code Organization
- **Maximum 300 lines per file** - Keeps code maintainable
- **Feature-based organization** - Related code grouped together
- **Separation of concerns** - Clear separation between layers
- **Type safety** - TypeScript throughout the frontend

### Authentication Flow
1. User registers/logs in through web interface
2. API validates credentials and returns JWT token
3. Frontend stores token and includes in API requests
4. API validates token on protected routes
5. User-specific data isolation at database level

### Testing Strategy
- **API Tests**: Jest + Supertest for comprehensive endpoint testing
- **Web Tests**: Playwright for full user journey testing
- **Integration Tests**: Both API and web running together
- **Responsive Testing**: Mobile and desktop viewport testing

## Environment Variables

### API (.env in /api directory)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Web (.env.local in /web directory)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations:**
   ```bash
   cd api && npm run prisma:migrate
   ```

4. **Start production servers:**
   ```bash
   npm run start
   ```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite + Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Testing**: Jest + Supertest
- **Validation**: express-validator

### Frontend
- **Framework**: NextJS 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Context
- **Forms**: React Hook Form + Zod
- **Testing**: Playwright
- **HTTP Client**: Axios

### Development Tools
- **Process Management**: concurrently
- **Testing**: Playwright, Jest
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Contributing

1. Follow the 300-line file limit
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Use TypeScript for type safety
5. Follow existing code organization patterns

## License

MIT