# TMS Backend

Transport Management System Backend built with NestJS, TypeORM, and PostgreSQL.

## Features

- **User Registration**: Signup system with automatic admin creation for first user
- **JWT Authentication**: Secure JWT-based authentication with role-based access control
- **Users Management**: CRUD operations for system users (admin, manager, dispatcher)
- **Drivers Management**: CRUD operations for drivers with status tracking
- **Orders Management**: CRUD operations for orders with driver assignment
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with TypeORM migrations and seeding
- **Auto-setup**: Automatic database schema creation and admin user seeding

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure Database
# Copy .env.example → .env and configure your database credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_DATABASE=your_database

# 3. Run Migrations
npm run migration:run

# 4. Start the Project
npm run start:dev

# 5. Create your first account (becomes admin automatically)
# Use the frontend signup form or API endpoint
```

## User Registration & Authentication

### First User (Admin Creation)
**Only the first user** to sign up automatically becomes an **admin** with full system access. **All subsequent signup attempts are blocked** with an error message.

### Signup Process
1. Use the frontend signup form or API endpoint
2. Provide username, password, name, and email
3. **Only the first user** automatically gets admin role
4. **All subsequent signup attempts are blocked** with error: "Admin already exists! Only one admin is allowed. Please contact the existing admin to create your account."

### Example Signup Request:
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "yourpassword",
    "name": "System Administrator",
    "email": "admin@example.com"
  }'
```

### Example Login Request:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'
```

## Database Setup

The application automatically:
- Creates the database schema using TypeORM migrations
- Seeds the database with an admin user
- Ensures tables and admin user always exist

### Manual Database Operations

**Run Migrations:**
```bash
npm run typeorm migration:run
```

**Revert Last Migration:**
```bash
npm run typeorm migration:revert
```

**Generate New Migration:**
```bash
npm run typeorm migration:generate -- src/migrations/MigrationName
```

**Run Seeds Manually:**
```bash
npm run seed:run
```

**Check Migration Status:**
```bash
npm run typeorm migration:show
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The application will be available at:
- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration (first user becomes admin)
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Users
- `GET /users` - Get all users (protected)
- `POST /users` - Create user (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Drivers
- `GET /drivers` - Get all drivers (protected)
- `GET /drivers/available` - Get available drivers (protected)
- `POST /drivers` - Create driver (protected)
- `GET /drivers/:id` - Get driver by ID (protected)
- `GET /drivers/:id/stats` - Get driver statistics (protected)
- `PATCH /drivers/:id` - Update driver (protected)
- `PATCH /drivers/:id/status` - Update driver status (protected)
- `DELETE /drivers/:id` - Delete driver (protected)

### Orders
- `GET /orders` - Get all orders (protected)
- `GET /orders/tracking` - Get orders for tracking (public)
- `POST /orders` - Create order (protected)
- `GET /orders/:id` - Get order by ID (protected)
- `PATCH /orders/:id` - Update order (protected)
- `PATCH /orders/:id/assign-driver` - Assign driver to order (protected)
- `PATCH /orders/:id/status` - Update order status (protected)
- `DELETE /orders/:id` - Delete order (protected)

## Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication module
│   ├── users/          # Users management
│   ├── drivers/        # Drivers management
│   └── orders/         # Orders management
├── common/
│   ├── guards/         # JWT authentication guard
│   ├── interceptors/  # Request/response interceptors
│   └── utils/          # Utility functions
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

## Technologies Used

- **NestJS**: Progressive Node.js framework
- **TypeORM**: Object-relational mapping
- **PostgreSQL**: Database
- **JWT**: JSON Web Tokens for authentication
- **Swagger**: API documentation
- **bcrypt**: Password hashing
- **class-validator**: DTO validation

## Notes

- The application automatically creates database tables using TypeORM migrations
- Admin user is automatically seeded on first run
- Password hashing is handled automatically with bcrypt
- JWT tokens expire after 24 hours by default
- All protected routes require Bearer token authentication
- CORS is enabled for frontend communication
- Migrations ensure database schema consistency across environments
