# Online Shopping Cart - Microservices Application

A full-stack online shopping cart application built with Spring Boot microservices, React frontend, and Docker containerization.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
│                     (Port 3000/80)                          │
└────────────┬────────────────────────────────────────────────┘
             │ HTTP/REST
             │
┌────────────┴────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (Direct service communication)                  │
└─────┬──────────────┬──────────────┬─────────────────────────┘
      │              │              │
      │              │              │
┌─────▼──────┐ ┌────▼──────┐ ┌────▼──────┐
│  Product   │ │   Cart    │ │   Order   │
│  Service   │ │  Service  │ │  Service  │
│ (Port 8081)│ │(Port 8082)│ │(Port 8083)│
└─────┬──────┘ └────┬──────┘ └────┬──────┘
      │              │              │
      │              │              │
┌─────▼──────────────▼──────────────▼──────┐
│         MySQL Database                   │
└───────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Microservices framework
- **Spring Web** - REST API development
- **Spring Data JPA** - Database access
- **MySQL** - Relational database
- **Maven** - Build tool
- **Java 17** - Programming language

### Frontend
- **React 18.x** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for React production build

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **Maven 3.6+**
- **Docker** and **Docker Compose**
- **Kiro IDE** (recommended)

## Project Structure

```
online-shopping-cart/
├── product-service/          # Product management microservice
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── cart-service/             # Shopping cart microservice
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── order-service/            # Order processing microservice
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml        # Production Docker Compose
├── docker-compose.dev.yml    # Development Docker Compose
├── pom.xml                   # Parent POM
└── README.md
```

## Getting Started

### Option 1: Running with Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-shopping-cart
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Product Service: http://localhost:8081
   - Cart Service: http://localhost:8082
   - Order Service: http://localhost:8083

4. **Stop all services**
   ```bash
   docker-compose down
   ```

### Option 2: Running Locally (Development)

#### Backend Services

1. **Build all services**
   ```bash
   mvn clean install
   ```

2. **Run Product Service**
   ```bash
   cd product-service
   mvn spring-boot:run
   ```

3. **Run Cart Service** (in a new terminal)
   ```bash
   cd cart-service
   mvn spring-boot:run
   ```

4. **Run Order Service** (in a new terminal)
   ```bash
   cd order-service
   mvn spring-boot:run
   ```

#### Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000

### Option 3: Development with Docker Compose

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

This configuration:
- Exposes debug ports for backend services (5005, 5006, 5007)
- Enables hot-reload for React frontend
- Uses volume mounts for live code updates

## Quick Start on Windows

If you are using Windows, you can use the provided batch script to build and run the entire application:

```bat
run-app.bat
```

This script will:
- Remove all dangling Docker images to free up disk space before starting
- Build backend services with Maven
- Stop and remove all containers and volumes
- Build and start Docker containers
- Wait for services to start
- Open the application in your browser

## Using Kiro IDE

### Importing the Project

1. Open Kiro IDE
2. Select **File → Open Folder**
3. Navigate to the project directory and select it
4. Kiro will automatically detect the Maven project structure

### Running Services in Kiro IDE

#### Backend Services

1. **Configure Run Configurations**
   - Open Run/Debug Configurations
   - Add new Spring Boot configuration for each service
   - Set main class: `ProductServiceApplication`, `CartServiceApplication`, `OrderServiceApplication`
   - Set working directory to respective service folder

2. **Run Services**
   - Click the Run button for each service
   - Services will start on ports 8081, 8082, 8083

#### Frontend

1. **Open Terminal in Kiro**
   - Navigate to `frontend` directory
   - Run `npm install` (first time only)
   - Run `npm start`

### Debugging in Kiro IDE

#### Backend Services

1. **Local Debugging**
   - Set breakpoints in your code
   - Use Debug configuration instead of Run
   - Kiro will attach debugger automatically

2. **Remote Debugging (Docker)**
   - Start services with `docker-compose.dev.yml`
   - Create Remote Debug configuration
   - Set host: `localhost`, port: `5005` (Product), `5006` (Cart), `5007` (Order)
   - Click Debug to attach

### Docker Management in Kiro

1. **View Running Containers**
   - Open Docker panel in Kiro
   - See all running containers and their status

2. **View Logs**
   - Right-click on container
   - Select "View Logs"

3. **Restart Services**
   - Right-click on container
   - Select "Restart"

## API Endpoints

### Product Service (Port 8081)

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}/stock` - Update product stock
- `GET /api/products/{id}/available?quantity={qty}` - Check stock availability

### Cart Service (Port 8082)

- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item quantity
- `DELETE /api/cart/items/{itemId}` - Remove item from cart
- `DELETE /api/cart/{userId}` - Clear cart

### Order Service (Port 8083)

- `POST /api/orders` - Create new order
- `GET /api/orders/{userId}` - Get user's orders
- `GET /api/orders/order/{orderId}` - Get order by ID
- `PUT /api/orders/{orderId}/status` - Update order status

## Testing

### Running Tests

```bash
# Run all tests
mvn test

# Run tests for specific service
cd product-service
mvn test
```

### Accessing MySQL (Development)

Each service connects to a MySQL database. You can access MySQL using a client such as MySQL Workbench or the command line:

- Host: localhost
- Port: 3306
- Username: root
- Password: (see docker-compose.yml)

**Example JDBC URLs:**
- Product Service: `jdbc:mysql://localhost:3306/productdb`
- Cart Service: `jdbc:mysql://localhost:3306/cartdb`
- Order Service: `jdbc:mysql://localhost:3306/orderdb`

## Configuration

### Environment Variables

Backend services can be configured using environment variables:

- `SERVER_PORT` - Service port (default: 8081, 8082, 8083)
- `SPRING_PROFILES_ACTIVE` - Active profile (dev/prod)
- `PRODUCT_SERVICE_URL` - Product service URL for inter-service communication

Frontend environment variables:

- `REACT_APP_PRODUCT_SERVICE_URL` - Product service URL
- `REACT_APP_CART_SERVICE_URL` - Cart service URL
- `REACT_APP_ORDER_SERVICE_URL` - Order service URL

### Application Properties

Each service has `application.properties` in `src/main/resources/`:

```properties
# Example: product-service/src/main/resources/application.properties
spring.application.name=product-service
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/productdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```
Error: Port 8081 is already in use
```
Solution: Stop the process using the port or change the port in `application.properties`

**2. Cannot Connect to Service**
```
Error: Connection refused
```
Solution: Ensure all services are running and check firewall settings

**3. Docker Build Fails**
```
Error: Cannot build Docker image
```
Solution: Ensure Docker is running and you have sufficient disk space

**4. Frontend Cannot Connect to Backend**
```
Error: Network Error
```
Solution: Check that backend services are running and CORS is properly configured

**5. Maven Build Fails**
```
Error: Could not resolve dependencies
```
Solution: Run `mvn clean install -U` to force update dependencies

### Logs

**View Docker Logs:**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs product-service

# Follow logs
docker-compose logs -f
```

**View Application Logs:**
Logs are printed to console by default. In production, configure logging to files.

## Docker Image Cleanup

Dangling Docker images (unused images) can accumulate and consume disk space. The `run-app.bat` script on Windows will automatically remove these before starting the application using:

```sh
docker image prune -f
```

For Linux/macOS users, you can run this command manually if needed.

## Production Deployment

### Building for Production

1. **Build backend services**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Build Docker images**
   ```bash
   docker-compose build
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Production Considerations

- Use PostgreSQL or MySQL for production
- Enable HTTPS/TLS
- Implement authentication and authorization
- Add API rate limiting
- Configure proper logging and monitoring
- Set up health checks and auto-restart policies
- Use environment-specific configuration files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Docker for containerization platform
