# Stage 1: Build stage with Maven and OpenJDK 21
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Prevent Maven OOM on Render Free / Starter build nodes (512MB RAM limits)
ENV MAVEN_OPTS="-Xmx768m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"

# Copy pom.xml to cache dependencies in a Docker layer
COPY pom.xml ./
RUN mvn dependency:resolve -Dmaven.test.skip=true -B || true

# Copy source code and build production jar (skips test compilation & test dependency downloads)
COPY src ./src
RUN mvn package -Dmaven.test.skip=true -B

# Stage 2: Lightweight JRE 21 Runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Security: Run as a non-privileged system user
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns dynamic PORT (defaults to 10000 on Render, 8080 locally)
ENV PORT=8080
EXPOSE ${PORT}

# JVM tuning for container environments (respects Render RAM limits)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

