# Multi-stage Dockerfile for Spring Boot deployed from repository root
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Prevent Maven OOM on Render Free / Starter build nodes (512MB RAM limits)
ENV MAVEN_OPTS="-Xmx768m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"

# Copy pom.xml from job-portal module and pre-cache runtime dependencies
COPY job-portal/pom.xml ./
RUN mvn dependency:resolve -Dmaven.test.skip=true -B || true

# Copy source code and build production jar (skips test compilation & test dependency downloads)
COPY job-portal/src ./src
RUN mvn package -Dmaven.test.skip=true -B

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre
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

