# Multi-stage Dockerfile for Spring Boot deployed from repository root
FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /app

# Copy pom.xml from job-portal module
COPY job-portal/pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and package
COPY job-portal/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:25-jre
WORKDIR /app

# Security: Run as non-privileged system user
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

# Memory optimization for cloud container limits (Render Free / Starter tier)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

