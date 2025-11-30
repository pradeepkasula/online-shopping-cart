# Design Document

## Overview

This design document outlines the architecture for a full-stack online shopping cart application using Spring Boot microservices, React frontend, and Docker containerization. The system follows a microservices architecture pattern where each service is independently deployable and scalable. The frontend communicates with backend services through RESTful APIs, and all components are containerized for consistent deployment.

## Architecture

### System Architecture

The application follows a microservices architecture with the following components:

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
│         H2 Database (Development)         │
│    PostgreSQL/MySQL (Production)          │
└───────────────────────────────────────────┘
```

### Communication Patterns

- **Frontend to Backend**: REST API calls using Axios
- **Service to Service**: REST API calls for inter-service communication
- **Database Access**: Spring Data JPA with repository pattern

### Technology Stack

**Backend:**
- Spring Boot 3.x
- Spring Web (REST APIs)
- Spring Data JPA (ORM)
- H2 Database (development)
- Maven (build tool)
- Java 17+

**Frontend:**
- React 18.x
- React Router (navigation)
- Axios (HTTP client)
- Context API (state management)
- CSS Modules or Styled Components

**Infrastructure:**
- Docker
- Docker Compose
- Nginx (React production server)

## Components and Interfaces

### Product Service

**Responsibilities:**
- Manage product catalog
- Handle product CRUD operations
- Track inventory levels
- Validate stock availability

**REST API Endpoints:**

```
GET    /api/products           - List all products
GET    /api/products/{id}      - Get product by ID
POST   /api/products           - Create new product (admin)
PUT    /api/products/{id}      - Update product (admin)
DELETE /api/products/{id}      - Delete product (admin)
PUT    /api/products/{id}/stock - Update stock quantity
```

**Key Classes:**
- `Product` (Entity): id, name, description, price, stock
- `ProductRepository` (Repository): JPA repository interface
- `ProductService` (Service): Business logic
- `ProductController` (Controller): REST endpoints

### Cart Service

**Responsibilities:**
- Manage user shopping carts
- Add/remove/update cart items
- Calculate cart totals
- Validate cart operations

**REST API Endpoints:**

```
GET    /api/cart/{userId}              - Get user's cart
POST   /api/cart/items                 - Add item to cart
PUT    /api/cart/items/{itemId}        - Update cart item quantity
DELETE /api/cart/items/{itemId}        - Remove item from cart
DELETE /api/cart/{userId}              - Clear cart
```

**Key Classes:**
- `CartItem` (Entity): id, userId, productId, quantity
- `CartItemRepository` (Repository): JPA repository interface
- `CartService` (Service): Business logic with product validation
- `CartController` (Controller): REST endpoints

### Order Service

**Responsibilities:**
- Process order creation
- Validate order against inventory
- Update order status
- Coordinate with Product Service for stock updates

**REST API Endpoints:**

```
GET    /api/orders/{userId}     - Get user's orders
GET    /api/orders/{orderId}    - Get order details
POST   /api/orders              - Create new order
PUT    /api/orders/{orderId}/status - Update order status
```

**Key Classes:**
- `Order` (Entity): id, userId, orderDate, status, totalAmount
- `OrderItem` (Entity): id, orderId, productId, quantity, price
- `OrderRepository` (Repository): JPA repository interface
- `OrderService` (Service): Business logic with transaction management
- `OrderController` (Controller): REST endpoints

### React Frontend

**Component Structure:**

```
src/
├── components/
│   ├── Navigation/
│   │   └── NavBar.jsx
│   ├── Products/
│   │   ├── ProductList.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductDetail.jsx
│   ├── Cart/
│   │   ├── Cart.jsx
│   │   └── CartItem.jsx
│   └── Checkout/
│       └── Checkout.jsx
├── context/
│   └── CartContext.jsx
├── services/
│   ├── productService.js
│   ├── cartService.js
│   └── orderService.js
├── App.jsx
└── index.jsx
```

**Key Components:**
- `NavBar`: Navigation with cart count badge
- `ProductList`: Grid display of products
- `ProductCard`: Individual product display with add-to-cart
- `ProductDetail`: Detailed product view
- `Cart`: Shopping cart with item management
- `CartItem`: Individual cart item with quantity controls
- `Checkout`: Order placement interface

**State Management:**
- `CartContext`: Global cart state using React Context API
- Local component state for UI interactions

## Data Models

### Product Entity

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stock;
    
    // Getters, setters, constructors
}
```

### CartItem Entity

```java
@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long productId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    // Getters, setters, constructors
}
```

### Order Entity

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    @Column(nullable = false)
    private BigDecimal totalAmount;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    // Getters, setters, constructors
}
```

### OrderItem Entity

```java
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(nullable = false)
    private Long productId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    // Getters, setters, constructors
}
```

### Database Schema Relationships

- `Order` has one-to-many relationship with `OrderItem`
- `CartItem` references `Product` by productId (loose coupling)
- `OrderItem` references `Product` by productId (loose coupling)


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Product Service Properties

**Property 1: Product data integrity**
*For any* product stored in the system, retrieving that product by ID should return all fields (id, name, description, price, stock) with values matching what was stored.
**Validates: Requirements 1.1, 1.2**

**Property 2: Out-of-stock indication**
*For any* product with stock quantity of zero, the rendered UI output should contain an out-of-stock indicator.
**Validates: Requirements 1.4**

### Cart Service Properties

**Property 3: Cart item round-trip**
*For any* valid cart item (userId, productId, quantity), adding it to the cart and then retrieving the cart should include that item with the same values.
**Validates: Requirements 2.1**

**Property 4: Stock validation on cart operations**
*For any* product with stock quantity S and any requested quantity Q where Q > S, attempting to add Q items to the cart should be rejected with an error.
**Validates: Requirements 2.2, 2.3**

**Property 5: Cart item removal**
*For any* cart containing an item, removing that item should result in a cart that no longer contains that item.
**Validates: Requirements 2.4**

**Property 6: Cart total calculation**
*For any* cart with items, the total price should equal the sum of (quantity × price) for all items in the cart.
**Validates: Requirements 2.5**

### Order Service Properties

**Property 7: Order creation with pending status**
*For any* valid cart data and user ID, creating an order should produce an order with status "pending", a timestamp, and all cart items as order items.
**Validates: Requirements 3.1, 3.3**

**Property 8: Stock reduction invariant**
*For any* product with initial stock S and any order containing quantity Q of that product, successfully placing the order should result in the product having stock (S - Q).
**Validates: Requirements 3.4**

**Property 9: Order failure preserves cart state**
*For any* cart state and any order creation attempt that fails due to insufficient stock, the cart should remain in its original state unchanged.
**Validates: Requirements 3.5**

**Property 10: Order validation**
*For any* order creation request, the system should validate product availability before creating the order, and reject orders for products with insufficient stock.
**Validates: Requirements 3.2**

### API Properties

**Property 11: Product list endpoint returns array**
*For any* state of the product catalog, a GET request to /api/products should return a JSON array (possibly empty).
**Validates: Requirements 4.1**

**Property 12: Product by ID endpoint behavior**
*For any* product ID, a GET request to /api/products/{id} should return the product with 200 status if it exists, or 404 status if it does not exist.
**Validates: Requirements 4.2**

**Property 13: Cart isolation**
*For any* two different user IDs, adding items to one user's cart should not affect the other user's cart contents.
**Validates: Requirements 4.4**

### Transaction Properties

**Property 14: Transaction rollback on failure**
*For any* database operation that fails mid-transaction, all changes within that transaction should be rolled back, leaving the database in its pre-transaction state.
**Validates: Requirements 8.4**

**Property 15: Database error handling**
*For any* database connection failure, the microservice should return an HTTP 500 status code and log the error.
**Validates: Requirements 8.5**

### Frontend Properties

**Property 16: Client-side routing**
*For any* navigation action within the application, the page should not perform a full reload (window.location should remain unchanged).
**Validates: Requirements 7.1**

**Property 17: Loading state feedback**
*For any* asynchronous operation, a loading indicator should be present in the DOM while the operation is in progress.
**Validates: Requirements 7.2**

**Property 18: Error message display**
*For any* failed API call, the UI should display an error message to the user.
**Validates: Requirements 7.3**

**Property 19: Cart count synchronization**
*For any* cart state change (add/remove/update), the cart count displayed in the navigation bar should reflect the total number of items in the cart.
**Validates: Requirements 7.5**

## Error Handling

### Backend Error Handling

**Product Service:**
- Return 404 for non-existent product IDs
- Return 400 for invalid product data (negative prices, null names)
- Return 500 for database connection failures
- Log all errors with appropriate severity levels

**Cart Service:**
- Return 400 for invalid cart operations (negative quantities, non-existent products)
- Return 409 for stock conflicts (insufficient inventory)
- Return 404 for non-existent cart items
- Validate product existence by calling Product Service

**Order Service:**
- Return 400 for invalid order data
- Return 409 for stock conflicts during order placement
- Return 500 for transaction failures
- Implement retry logic for transient failures
- Use distributed transactions or saga pattern for multi-service operations

### Frontend Error Handling

**Network Errors:**
- Display user-friendly messages for connection failures
- Implement retry mechanisms for failed requests
- Show loading states during retries

**Validation Errors:**
- Display inline validation messages
- Prevent form submission with invalid data
- Highlight fields with errors

**Business Logic Errors:**
- Display error messages from backend responses
- Provide actionable guidance (e.g., "Product out of stock")
- Allow users to recover gracefully

### Global Error Handling

- Implement error boundaries in React to catch rendering errors
- Use Axios interceptors for centralized error handling
- Log errors to console in development mode
- Implement proper CORS configuration for cross-origin requests

## Testing Strategy

### Unit Testing

**Backend (JUnit 5 + Mockito):**
- Test repository methods with H2 in-memory database
- Test service layer business logic with mocked repositories
- Test controller endpoints with MockMvc
- Test specific edge cases:
  - Empty product catalog
  - Cart with single item
  - Order with zero total
  - Database constraint violations

**Frontend (Jest + React Testing Library):**
- Test component rendering with various props
- Test user interactions (clicks, form submissions)
- Test conditional rendering (loading states, errors)
- Test specific scenarios:
  - Empty cart display
  - Product out of stock
  - Failed API calls

### Property-Based Testing

**Framework:** Use **QuickCheck-style** property-based testing libraries:
- **Backend**: Use **jqwik** (Java property-based testing library)
- **Frontend**: Use **fast-check** (JavaScript/TypeScript property-based testing)

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Each test MUST be tagged with a comment referencing the correctness property
- Tag format: `// Feature: shopping-cart-microservices, Property {number}: {property_text}`

**Property Test Coverage:**
- Each correctness property listed above MUST be implemented as a SINGLE property-based test
- Generate random valid inputs (products, cart items, orders) for positive tests
- Generate random invalid inputs for negative tests
- Test invariants across state transitions

**Example Property Test Structure:**

```java
// Feature: shopping-cart-microservices, Property 1: Product data integrity
@Property(tries = 100)
void productDataIntegrity(@ForAll Product product) {
    // Store product
    Product saved = productRepository.save(product);
    
    // Retrieve product
    Product retrieved = productRepository.findById(saved.getId()).orElseThrow();
    
    // Verify all fields match
    assertThat(retrieved).isEqualTo(saved);
}
```

### Integration Testing

- Test inter-service communication using TestContainers
- Test Docker Compose setup with automated scripts
- Test database migrations and schema initialization
- Test end-to-end user flows (browse → add to cart → checkout)

### Test Execution Strategy

1. **Development**: Run unit tests on every build
2. **Pre-commit**: Run unit tests and property-based tests
3. **CI/CD Pipeline**: Run all tests including integration tests
4. **Property-based tests**: Run with increased iterations (1000+) in CI

## Deployment Architecture

### Docker Configuration

**Dockerfile Structure (Spring Boot Services):**

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Dockerfile Structure (React Application):**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

**Services:**
- `product-service`: Port 8081
- `cart-service`: Port 8082
- `order-service`: Port 8083
- `frontend`: Port 3000 (development) or 80 (production)
- `database`: Port 5432 (PostgreSQL) or in-memory (H2)

**Networks:**
- Create a custom bridge network for service communication
- Expose only frontend and necessary API ports to host

**Volumes:**
- Database data volume for persistence
- Optional volumes for logs

**Environment Variables:**
- Database connection strings
- Service URLs for inter-service communication
- Active Spring profiles (dev/prod)

### Development vs Production

**Development:**
- Use H2 in-memory database
- Enable hot-reload for React (volume mount source code)
- Enable Spring Boot DevTools
- Expose all service ports for debugging
- Use docker-compose.dev.yml

**Production:**
- Use PostgreSQL or MySQL
- Serve optimized React build through Nginx
- Enable health checks and restart policies
- Use environment-specific configuration
- Use docker-compose.prod.yml
- Implement proper logging and monitoring

## Security Considerations

### API Security

- Implement CORS configuration to allow frontend origin
- Add request validation for all endpoints
- Sanitize user inputs to prevent injection attacks
- Implement rate limiting for API endpoints

### Data Security

- Use parameterized queries (JPA handles this)
- Validate all numeric inputs (prices, quantities, IDs)
- Implement proper error messages that don't leak system information

### Container Security

- Use non-root users in Docker containers
- Scan images for vulnerabilities
- Keep base images updated
- Use multi-stage builds to minimize image size

## Performance Considerations

### Backend Optimization

- Implement database connection pooling
- Add indexes on frequently queried fields (userId, productId)
- Use pagination for product listings
- Implement caching for product catalog (optional)

### Frontend Optimization

- Implement lazy loading for routes
- Optimize bundle size with code splitting
- Use React.memo for expensive components
- Debounce search and filter operations

### Database Optimization

- Use appropriate data types (BigDecimal for prices)
- Implement proper indexing strategy
- Use batch operations for bulk updates
- Monitor query performance

## Monitoring and Observability

### Logging

- Use SLF4J with Logback for backend logging
- Log all API requests and responses
- Log business events (order placed, stock updated)
- Use structured logging (JSON format)

### Health Checks

- Implement Spring Boot Actuator endpoints
- Add custom health indicators for database connectivity
- Configure Docker health checks
- Monitor service availability

### Metrics

- Track API response times
- Monitor database connection pool usage
- Track order success/failure rates
- Monitor cart abandonment rates

## Development Workflow in Kiro IDE

### Project Setup

1. Import multi-module Maven project
2. Configure JDK 17+ in project settings
3. Enable annotation processing for Lombok (if used)
4. Configure Docker integration

### Running Services

**Development Mode:**
- Use Kiro's Docker integration to start docker-compose
- Configure run configurations for each Spring Boot service
- Use Kiro's terminal to run React development server
- Set up compound run configurations to start all services

**Debugging:**
- Configure remote debugging for Spring Boot services in containers
- Use Kiro's debugger with breakpoints
- Enable debug logging in application.properties

### Testing

- Use Kiro's test runner for JUnit tests
- Configure test coverage reporting
- Run property-based tests with increased iterations
- Use Kiro's terminal for integration tests

### Docker Management

- Use Kiro's Docker panel to view running containers
- Monitor container logs within IDE
- Restart services as needed
- View container resource usage

## Future Enhancements

### Phase 2 Features

- User Service with authentication (JWT)
- Payment integration
- Order history and tracking
- Product search and filtering
- Product categories and tags

### Scalability Improvements

- Implement API Gateway (Spring Cloud Gateway)
- Add service discovery (Eureka)
- Implement circuit breakers (Resilience4j)
- Add message queue for async operations (RabbitMQ/Kafka)
- Implement distributed caching (Redis)

### Advanced Features

- Real-time inventory updates (WebSocket)
- Product recommendations
- Shopping cart persistence across sessions
- Multi-currency support
- Internationalization (i18n)
