# TMS Backend

Transport Management System Backend built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Users Management**: CRUD operations for system users (admin, manager, dispatcher)
- **Drivers Management**: CRUD operations for drivers with status tracking
- **Orders Management**: CRUD operations for orders with driver assignment
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with TypeORM (connects to existing schema)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=your_database

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

## Database Setup

This application connects to an existing PostgreSQL database. Make sure your database is running and accessible with the credentials in your `.env` file.

### Seed Data

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 sample users (admin, manager, dispatcher)
- 4 sample drivers
- 4 sample orders

**Default Login Credentials:**
- Username: `admin`, Password: `password123` (Admin)
- Username: `manager`, Password: `password123` (Manager)  
- Username: `dispatcher`, Password: `password123` (Dispatcher)

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

- The application connects to existing database tables (no migrations)
- Password hashing is handled automatically
- JWT tokens expire after 24 hours by default
- All protected routes require Bearer token authentication
- CORS is enabled for frontend communication
