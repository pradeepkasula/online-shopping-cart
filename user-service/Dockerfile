# Use official OpenJDK image as a parent image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install bash for wait-for-it.sh script
RUN apk add --no-cache bash

# Copy the pre-built JAR
COPY user-service/target/user-service-*.jar user-service.jar

# Copy wait-for-it.sh script
COPY user-service/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose port
EXPOSE 8084

# Run the application with wait-for-it.sh
ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "user-service.jar"]
