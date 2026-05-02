# Multi-stage Dockerfile optimized for Cloud Run

# Build stage
FROM maven:3.9.4-eclipse-temurin-17 as build
WORKDIR /workspace

# Copy Maven configuration files
COPY pom.xml .
COPY mvnw mvnw
COPY .mvn .mvn

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests clean package

# Runtime stage: use minimal JRE image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /workspace/target/upload-picture-*.jar app.jar

# Cloud Run requires the application to listen on PORT env variable (default: 8080)
# Our app uses 8090, so we use SPRING_SERVER_PORT env variable
EXPOSE 8080

# Set entry point
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
