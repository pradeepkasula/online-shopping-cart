# Use official OpenJDK image as a parent image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY target/order-service-*.jar order-service.jar

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "order-service.jar"]
