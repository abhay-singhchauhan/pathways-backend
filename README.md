# Pathways Backend API

A robust Node.js/Express backend API built with TypeScript, MongoDB, and Mongoose following MVC architecture.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers
- **MongoDB Integration**: Using Mongoose ODM for database operations
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Input Validation**: Comprehensive validation using Joi
- **Security**: Helmet for security headers, bcrypt for password hashing
- **Error Handling**: Global error handling middleware
- **TypeScript**: Full TypeScript support with strict typing
- **API Documentation**: RESTful API with comprehensive endpoints

## 📁 Project Structure

```
pathways-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── controllers/
│   │   └── user.controller.ts   # User business logic
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Authentication & authorization
│   │   └── error.middleware.ts  # Global error handling
│   ├── models/
│   │   └── user.model.ts        # User Mongoose schema
│   ├── routes/
│   │   ├── index.ts             # Main router
│   │   └── user.routes.ts       # User routes
│   ├── types/
│   │   └── user.types.ts        # TypeScript interfaces
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   └── validation.ts        # Joi validation schemas
│   └── index.ts                 # Main application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pathways_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

3. **Start MongoDB:**
Make sure MongoDB is running on your system.

4. **Run the application:**
```bash
# Development mode with auto-reload
npm run dev

# Production build
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Endpoints

#### 1. Register User
**POST** `/api/users/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+1234567890",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. Login User
**POST** `/api/users/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get Current User Profile
**GET** `/api/users/profile`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### 4. Get User by ID
**GET** `/api/users/:id`

Get a specific user by their ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true
    }
  }
}
```

#### 5. Update User
**PUT** `/api/users/:id`

Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "john.doe@example.com",
      "phoneNumber": "+1987654321",
      "role": "user",
      "isActive": true
    }
  }
}
```

#### 6. Get All Users (Admin Only)
**GET** `/api/users`

Get all users with pagination. Requires admin role.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "user",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 7. Delete User (Admin Only)
**DELETE** `/api/users/:id`

Soft delete a user (sets isActive to false). Requires admin role.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Health Check

#### Health Status
**GET** `/api/health`

Check API status and get system information.

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔒 Authentication & Authorization

### Roles
- **user**: Default role for regular users
- **therapist**: For healthcare providers
- **admin**: Full system access

### JWT Token
- Tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- Include user ID, email, and role in payload
- Required for all protected routes

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schemas for all inputs
- **Security Headers**: Helmet middleware
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Ready for implementation
- **Data Sanitization**: Mongoose built-in sanitization

## 📝 Data Models

### User Model
```typescript
{
  firstName: string;        // Required, max 50 chars
  lastName: string;         // Required, max 50 chars
  email: string;           // Required, unique, validated
  password: string;        // Required, min 6 chars, hashed
  dateOfBirth?: Date;      // Optional, must be past date
  phoneNumber?: string;    // Optional, validated format
  role: 'user' | 'admin' | 'therapist'; // Default: 'user'
  isActive: boolean;       // Default: true
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-generated
}
```

## 🐛 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## 🧪 Testing the API

You can test the API using tools like Postman, Insomnia, or curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Next Steps

1. **Install MongoDB** if not already installed
2. **Set up your environment variables** in `.env`
3. **Run the application** with `npm run dev`
4. **Test the endpoints** using your preferred API client
5. **Extend the functionality** by adding more models and controllers

## 📞 Support

For questions or support, please refer to the API documentation or create an issue in the project repository. 