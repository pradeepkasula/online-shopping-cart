# Implementation Plan

- [x] 1. Set up project structure and build configuration



  - Create multi-module Maven project with parent POM
  - Create modules: product-service, cart-service, order-service, frontend
  - Configure Spring Boot dependencies and versions
  - Set up H2 database configuration for development
  - _Requirements: 8.1, 8.3_

- [ ] 2. Implement Product Service
  - _Requirements: 1.1, 1.2, 4.1, 4.2_

- [x] 2.1 Create Product entity and repository


  - Implement Product entity with JPA annotations (id, name, description, price, stock)
  - Create ProductRepository interface extending JpaRepository
  - _Requirements: 1.1, 1.2_

- [ ]* 2.2 Write property test for Product data integrity
  - **Property 1: Product data integrity**
  - **Validates: Requirements 1.1, 1.2**

- [x] 2.3 Implement ProductService with business logic


  - Create ProductService class with methods: getAllProducts, getProductById, updateStock
  - Add validation for product data
  - Implement stock availability checking
  - _Requirements: 1.1, 1.2_



- [ ] 2.4 Create ProductController REST endpoints
  - Implement GET /api/products endpoint
  - Implement GET /api/products/{id} endpoint
  - Implement PUT /api/products/{id}/stock endpoint
  - Add proper HTTP status codes and error handling
  - _Requirements: 4.1, 4.2_

- [ ]* 2.5 Write property test for Product list endpoint
  - **Property 11: Product list endpoint returns array**
  - **Validates: Requirements 4.1**

- [ ]* 2.6 Write property test for Product by ID endpoint
  - **Property 12: Product by ID endpoint behavior**
  - **Validates: Requirements 4.2**

- [ ]* 2.7 Write unit tests for Product Service
  - Test getAllProducts with empty and populated database
  - Test getProductById with valid and invalid IDs
  - Test updateStock with valid quantities
  - _Requirements: 1.1, 1.2_


- [ ] 3. Implement Cart Service
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.3, 4.4_

- [x] 3.1 Create CartItem entity and repository

  - Implement CartItem entity with JPA annotations (id, userId, productId, quantity)
  - Create CartItemRepository interface with custom queries for userId
  - _Requirements: 2.1_

- [ ]* 3.2 Write property test for Cart item round-trip
  - **Property 3: Cart item round-trip**
  - **Validates: Requirements 2.1**

- [x] 3.3 Implement CartService with product validation


  - Create CartService class with methods: addItem, updateItem, removeItem, getCart, clearCart
  - Integrate with Product Service to validate stock availability
  - Implement cart total calculation logic
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.4 Write property test for stock validation
  - **Property 4: Stock validation on cart operations**
  - **Validates: Requirements 2.2, 2.3**

- [ ]* 3.5 Write property test for cart item removal
  - **Property 5: Cart item removal**
  - **Validates: Requirements 2.4**

- [ ]* 3.6 Write property test for cart total calculation
  - **Property 6: Cart total calculation**
  - **Validates: Requirements 2.5**

- [x] 3.7 Create CartController REST endpoints


  - Implement GET /api/cart/{userId} endpoint
  - Implement POST /api/cart/items endpoint
  - Implement PUT /api/cart/items/{itemId} endpoint
  - Implement DELETE /api/cart/items/{itemId} endpoint
  - Implement DELETE /api/cart/{userId} endpoint
  - Add error handling for stock conflicts
  - _Requirements: 4.3, 4.4_

- [ ]* 3.8 Write property test for cart isolation
  - **Property 13: Cart isolation**
  - **Validates: Requirements 4.4**

- [ ]* 3.9 Write unit tests for Cart Service
  - Test addItem with valid and invalid products
  - Test updateItem with stock constraints
  - Test removeItem functionality
  - Test getCart for different users
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Implement Order Service
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.5_

- [x] 4.1 Create Order and OrderItem entities


  - Implement Order entity with JPA annotations (id, userId, orderDate, status, totalAmount)
  - Implement OrderItem entity with relationship to Order
  - Create OrderStatus enum (PENDING, CONFIRMED, FAILED)
  - Create OrderRepository and OrderItemRepository interfaces
  - _Requirements: 3.1_

- [ ]* 4.2 Write property test for order creation with pending status
  - **Property 7: Order creation with pending status**
  - **Validates: Requirements 3.1, 3.3**

- [x] 4.3 Implement OrderService with transaction management


  - Create OrderService class with createOrder method
  - Implement product availability validation via Product Service
  - Implement stock reduction logic via Product Service
  - Add transaction management with @Transactional
  - Implement order status updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 4.4 Write property test for stock reduction invariant
  - **Property 8: Stock reduction invariant**
  - **Validates: Requirements 3.4**

- [ ]* 4.5 Write property test for order failure preserves cart
  - **Property 9: Order failure preserves cart state**
  - **Validates: Requirements 3.5**

- [ ]* 4.6 Write property test for order validation
  - **Property 10: Order validation**
  - **Validates: Requirements 3.2**

- [x] 4.7 Create OrderController REST endpoints


  - Implement POST /api/orders endpoint
  - Implement GET /api/orders/{userId} endpoint
  - Implement GET /api/orders/{orderId} endpoint
  - Add error handling for stock conflicts and validation failures
  - _Requirements: 4.5_

- [ ]* 4.8 Write property test for transaction rollback
  - **Property 14: Transaction rollback on failure**
  - **Validates: Requirements 8.4**

- [ ]* 4.9 Write property test for database error handling
  - **Property 15: Database error handling**
  - **Validates: Requirements 8.5**

- [ ]* 4.10 Write unit tests for Order Service
  - Test createOrder with valid cart data
  - Test createOrder with insufficient stock
  - Test order status transitions
  - Test transaction rollback scenarios
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Configure CORS and inter-service communication


  - Add CORS configuration to all services to allow frontend origin
  - Configure RestTemplate or WebClient beans for service-to-service calls
  - Add error handling for inter-service communication failures
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 6. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Set up React frontend project structure


  - Initialize React application with Create React App or Vite
  - Install dependencies: react-router-dom, axios
  - Create folder structure: components, services, context, pages
  - Set up React Router with routes for products, cart, checkout
  - _Requirements: 7.1_

- [x] 8. Implement API service layer


  - Create productService.js with API calls to Product Service
  - Create cartService.js with API calls to Cart Service
  - Create orderService.js with API calls to Order Service
  - Configure Axios base URL and error interceptors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 9. Implement Cart Context for state management


  - Create CartContext with React Context API
  - Implement cart state (items, count, total)
  - Implement cart actions (add, remove, update, clear)
  - Provide context to application
  - _Requirements: 2.1, 2.4, 7.5_

- [ ] 10. Implement Product components
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 10.1 Create ProductList component


  - Fetch products from Product Service on mount
  - Display products in grid layout
  - Show loading state while fetching
  - Handle and display errors
  - _Requirements: 1.1_

- [x] 10.2 Create ProductCard component


  - Display product name, description, price, and stock
  - Show "Add to Cart" button
  - Disable button and show out-of-stock message when stock is zero
  - Handle add-to-cart action
  - _Requirements: 1.1, 1.4_

- [ ]* 10.3 Write property test for out-of-stock indication
  - **Property 2: Out-of-stock indication**
  - **Validates: Requirements 1.4**

- [x] 10.4 Create ProductDetail component


  - Fetch single product by ID
  - Display full product details
  - Include add-to-cart functionality
  - Handle product not found errors
  - _Requirements: 1.2_

- [ ] 11. Implement Cart components
  - _Requirements: 2.4, 2.5, 7.5_

- [x] 11.1 Create Cart component


  - Display all cart items
  - Show cart total
  - Handle empty cart state
  - Include "Proceed to Checkout" button
  - _Requirements: 2.5_

- [x] 11.2 Create CartItem component


  - Display item details (name, price, quantity)
  - Implement quantity update controls
  - Implement remove item button
  - Update cart context on changes
  - _Requirements: 2.4_

- [ ]* 11.3 Write property test for cart count synchronization
  - **Property 19: Cart count synchronization**
  - **Validates: Requirements 7.5**

- [x] 12. Implement Navigation component


  - Create NavBar with links to Products and Cart pages
  - Display cart count badge
  - Update badge when cart changes
  - _Requirements: 7.5_

- [x] 13. Implement Checkout component


  - Display order summary with items and total
  - Implement "Place Order" button
  - Call Order Service to create order
  - Handle success (show confirmation, clear cart)
  - Handle errors (show error message, maintain cart)
  - _Requirements: 3.1, 3.5_

- [x] 14. Implement frontend error handling and loading states

  - Add loading indicators for all async operations
  - Implement error message display component
  - Add error boundaries for React errors
  - Handle API errors with user-friendly messages
  - _Requirements: 7.2, 7.3_

- [ ]* 14.1 Write property test for loading state feedback
  - **Property 17: Loading state feedback**
  - **Validates: Requirements 7.2**

- [ ]* 14.2 Write property test for error message display
  - **Property 18: Error message display**
  - **Validates: Requirements 7.3**

- [ ]* 14.3 Write property test for client-side routing
  - **Property 16: Client-side routing**
  - **Validates: Requirements 7.1**

- [ ]* 14.4 Write unit tests for React components
  - Test ProductList rendering and loading states
  - Test ProductCard with in-stock and out-of-stock products
  - Test Cart with items and empty state
  - Test Checkout flow
  - _Requirements: 1.1, 1.4, 2.4, 2.5, 3.1_

- [ ] 15. Checkpoint - Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Create Dockerfiles for all services
  - _Requirements: 5.1, 5.2_

- [x] 16.1 Create Dockerfile for Product Service


  - Use multi-stage build with Maven
  - Copy JAR file to runtime image
  - Expose port 8081
  - _Requirements: 5.1_

- [x] 16.2 Create Dockerfile for Cart Service


  - Use multi-stage build with Maven
  - Copy JAR file to runtime image
  - Expose port 8082
  - _Requirements: 5.1_

- [x] 16.3 Create Dockerfile for Order Service


  - Use multi-stage build with Maven
  - Copy JAR file to runtime image
  - Expose port 8083
  - _Requirements: 5.1_

- [x] 16.4 Create Dockerfile for React application


  - Use multi-stage build with Node.js
  - Build production bundle
  - Serve with Nginx
  - Copy custom nginx.conf
  - Expose port 80
  - _Requirements: 5.2_

- [ ] 17. Create Docker Compose configuration
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4_

- [x] 17.1 Create docker-compose.yml file


  - Define all services (product-service, cart-service, order-service, frontend)
  - Configure service dependencies and startup order
  - Create custom bridge network for inter-service communication
  - Expose ports: 8081, 8082, 8083, 80
  - Define environment variables for database connections and service URLs
  - Configure database volume for data persistence
  - Add health checks for all services
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.4_

- [x] 17.2 Create docker-compose.dev.yml for development


  - Override configurations for development mode
  - Enable volume mounts for hot-reload
  - Use H2 database configuration
  - Expose additional debugging ports
  - _Requirements: 8.3_

- [ ] 17.3 Test Docker Compose setup
  - Build all Docker images
  - Start all services with docker-compose up
  - Verify all containers are running
  - Test inter-service connectivity
  - Test frontend can access backend APIs
  - Test data persistence by stopping and restarting database
  - Test docker-compose down preserves volumes
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.3_

- [ ] 18. Create comprehensive README documentation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 18.1 Write README.md with setup instructions



  - Add project overview and architecture diagram
  - Document prerequisites (Java 17, Node.js, Docker, Maven)
  - Provide step-by-step instructions for importing project into Kiro IDE
  - Document how to build and run services locally
  - Document how to build and run Docker containers from Kiro IDE
  - Explain how to use Docker Compose for development
  - Document debugging configuration for Spring Boot services in Kiro IDE
  - Document how to run React in development and production modes
  - Add API endpoint documentation
  - Include troubleshooting section with common issues
  - Add section on running tests
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 19. Final integration testing and verification
  - Start all services using Docker Compose
  - Test complete user flow: browse products → add to cart → checkout
  - Verify stock updates after order placement
  - Test error scenarios (out of stock, invalid data)
  - Verify data persistence across container restarts
  - Ensure all tests pass, ask the user if questions arise.
