@echo off
echo Docker Cleanup Script
echo =====================
echo.

echo This will remove:
echo - Stopped containers
echo - Unused images
echo - Unused networks
echo - Build cache
echo.

set /p confirm="Do you want to continue? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo Cleanup cancelled.
    pause
    exit /b
)

echo.
echo Stopping all containers...
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.dev.yml down

echo.
echo Removing stopped containers...
docker container prune -f

echo.
echo Removing unused images...
docker image prune -a -f

echo.
echo Removing unused networks...
docker network prune -f

echo.
echo Removing build cache...
docker builder prune -f

echo.
echo Cleanup completed!
echo.
echo Current Docker status:
docker ps -a
echo.
docker images
echo.
pause
