@echo off
echo Starting Online Shopping Cart Application (Development Mode)...
echo.

echo Step 1: Building Maven projects...
echo Building product-service...
cd product-service
call mvn clean package -DskipTests
cd ..

echo Building cart-service...
cd cart-service
call mvn clean package -DskipTests
cd ..

echo Building order-service...
cd order-service
call mvn clean package -DskipTests
cd ..

echo Building user-service...
cd user-service
call mvn clean package -DskipTests
cd ..

echo.
echo Step 2: Building and starting all services with docker-compose.dev.yml...
docker-compose -f docker-compose.dev.yml up -d --build

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Application started successfully!
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Product Service: http://localhost:8081
echo - Cart Service: http://localhost:8082
echo - Order Service: http://localhost:8083
echo - User Service: http://localhost:8084
echo.
echo To view logs: docker-compose -f docker-compose.dev.yml logs -f
echo To stop: docker-compose -f docker-compose.dev.yml down
echo.
pause
