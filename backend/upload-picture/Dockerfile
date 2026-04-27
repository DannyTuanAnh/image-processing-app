# Multi-stage Dockerfile for building and running the Spring Boot app

# Build stage: use Maven with JDK 17
FROM maven:3.9.4-eclipse-temurin-17 as build
WORKDIR /workspace

# copy only pom first to leverage docker layer cache for dependencies
COPY backend/upload-picture/pom.xml .
COPY backend/upload-picture/mvnw mvnw
COPY backend/upload-picture/.mvn .mvn

# copy source
COPY backend/upload-picture/src ./src

# package the application (skip tests for faster builds)
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package

# Run stage: use a smaller JRE image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# copy jar from the build stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8090

ENTRYPOINT ["java","-jar","/app/app.jar"]
