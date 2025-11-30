# Use official OpenJDK image as a parent image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the pre-built JAR
COPY target/cart-service-*.jar cart-service.jar

# Copy wait-for-it.sh script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose port
EXPOSE 8082

# Run the application with wait-for-it.sh
ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "cart-service.jar"]
