FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the pre-built JAR
COPY target/*.jar app.jar

# Expose port
EXPOSE 8083

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
