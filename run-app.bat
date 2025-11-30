@echo off
echo ========================================
echo Shopping Cart Microservices Application
echo ========================================
echo.

echo Step 0: Removing all dangling Docker images...
echo ========================================
docker image prune -f

echo.
echo Step 1: Building backend services with Maven...
echo ========================================
call mvn clean package -DskipTests

echo.
echo Step 2: Stopping and removing all containers and volumes...
echo ========================================
call docker-compose down -v

echo.
echo Step 3: Building and starting Docker containers (force recreate)...
echo ========================================
call docker-compose up --build --force-recreate -d

echo.
echo Step 4: Waiting for services to start (20 seconds)...
echo ========================================
timeout /t 20 /nobreak

echo.
echo Step 5: Checking container status...
echo ========================================
docker ps

echo.
echo Step 6: Opening application in browser...
echo ========================================
start http://localhost

echo.
echo ========================================
echo Application is running!
echo ========================================
echo.
echo Frontend:        http://localhost
echo Product Service: http://localhost:8081
echo Cart Service:    http://localhost:8082
echo Order Service:   http://localhost:8083
echo User Service:    http://localhost:8084
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down -v
echo.
pause
