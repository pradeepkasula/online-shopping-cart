# Use official OpenJDK image as a parent image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY target/product-service-*.jar product-service.jar

# Wait for MySQL to be ready before starting the service
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose port
EXPOSE 8081

# Start the service
ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "product-service.jar"]
