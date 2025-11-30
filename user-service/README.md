# User Service - Online Shopping Cart

This is a Spring Boot microservice for user management in the Online Shopping Cart application.

## Features
- User registration (unique username, hashed password)
- Login (JWT authentication)
- Forgot password (generate and display temp password)
- Change password (required after login with temp password)
- User info endpoint
- MySQL database integration
- RESTful API

## Tech Stack
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL
- Maven

## Getting Started

1. Configure your MySQL database in `src/main/resources/application.properties`.
2. Build the project:
   ```pwsh
   ./mvnw clean install
   ```
3. Run the service:
   ```pwsh
   ./mvnw spring-boot:run
   ```

## API Endpoints
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login and receive JWT
- `POST /api/users/forgot-password` - Generate temp password
- `POST /api/users/change-password` - Change password
- `GET /api/users/me` - Get user info

## Docker
A `Dockerfile` will be added for containerization.

---
For more details, see the main project README.
