# E-Wallet Management System

A full-stack web application for managing digital wallets with secure authentication and transaction management.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security with JWT authentication
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts, MUI X-Charts
- **Animations**: Framer Motion

## Project Structure

```
├── reactapp/          # Frontend React application
├── springapp/         # Backend Spring Boot application
├── start-backend.bat  # Script to start backend server
└── start-frontend.bat # Script to start frontend server
```

## Prerequisites

- Java 17 or higher
- Node.js and npm
- MySQL database
- Maven

## Setup Instructions

### Backend Setup

1. Navigate to the `springapp` directory
2. Configure database connection in `application.properties`
3. Run the backend:
   ```bash
   start-backend.bat
   ```
   Or manually:
   ```bash
   cd springapp
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the `reactapp` directory
2. Install dependencies:
   ```bash
   cd reactapp
   npm install
   ```
3. Run the frontend:
   ```bash
   start-frontend.bat
   ```
   Or manually:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:8081`

## Features

- User authentication and authorization with JWT
- Secure wallet management
- Transaction processing
- Dashboard with analytics and charts
- Responsive UI with Material Design
- RESTful API with Swagger documentation

## Testing

### Backend Tests
```bash
cd springapp
mvn test
```

### Frontend Tests
```bash
cd reactapp
npm test
```

## API Documentation

Once the backend is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## License

This project is for educational purposes.
