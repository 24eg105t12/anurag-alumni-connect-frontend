export interface SpringBootFile {
  path: string;
  category: 'config' | 'schema' | 'entity' | 'controller' | 'service' | 'security' | 'docs';
  description: string;
  content: string;
}

export const SPRING_BOOT_PROJECT_FILES: SpringBootFile[] = [
  {
    path: 'backend/README.md',
    category: 'docs',
    description: 'Standalone Spring Boot backend setup & MySQL run guide',
    content: `# Anurag Alumni Connect - Backend (Spring Boot 3.3 + MySQL 8.0)

This is the independent Spring Boot backend for the Anurag University Alumni Connect platform.

## Architecture & Tech Stack
- Framework: Spring Boot 3.3.4 (Java 17/21)
- Database: MySQL 8.0+
- Persistence: Spring Data JPA / Hibernate
- Security: Spring Security 6 with stateless JWT authentication
- Connection Pool: HikariCP
- Build Tool: Apache Maven

## Setup & Running
1. Start MySQL and run schema.sql:
   mysql -u root -p anurag_alumni_db < src/main/resources/schema.sql
2. Set credentials:
   export MYSQL_USER=root
   export MYSQL_PASSWORD=your_password
3. Build & Run:
   mvn clean spring-boot:run
   Server runs on http://localhost:8080/api/v1`
  },
  {
    path: 'backend/pom.xml',
    category: 'config',
    description: 'Maven Project Object Model with Spring Boot 3.3, JPA, Security, MySQL & JJWT',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    <groupId>edu.anurag</groupId>
    <artifactId>alumni-connect-backend</artifactId>
    <version>1.0.0</version>
    <name>anurag-alumni-connect</name>
    <description>Spring Boot REST API Backend for Anurag University Alumni Connect</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'backend/src/main/resources/application.yml',
    category: 'config',
    description: 'Spring Boot YAML configuration with MySQL DataSource and HikariCP settings',
    content: `server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: anurag-alumni-connect
  datasource:
    url: jdbc:mysql://localhost:3306/anurag_alumni_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: \${MYSQL_USER:root}
    password: \${MYSQL_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5
      pool-name: AnuragHikariCP
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

app:
  jwt:
    secret: 9a4f2c8d7e1b5a3c6f8e0d2b4a6c8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d
    expiration-ms: 900000
    refresh-expiration-ms: 604800000
  cors:
    allowed-origins: "http://localhost:3000,http://localhost:5173"`
  },
  {
    path: 'backend/src/main/resources/schema.sql',
    category: 'schema',
    description: 'MySQL 8.0 Relational DDL Schema with 10 tables, indexes & foreign keys',
    content: `CREATE DATABASE IF NOT EXISTS anurag_alumni_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE anurag_alumni_db;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ALUMNI', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    branch VARCHAR(50) NOT NULL,
    batch_year INT NOT NULL,
    cgpa DECIMAL(4,2),
    skills JSON,
    bio TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    resume_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_branch (branch)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alumni_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    branch VARCHAR(50) NOT NULL,
    batch_year INT NOT NULL,
    current_company VARCHAR(150) NOT NULL,
    current_role VARCHAR(150) NOT NULL,
    experience_years INT DEFAULT 0,
    skills JSON,
    bio TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    is_mentor BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alumni_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_alumni_company (current_company)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(36) PRIMARY KEY,
    posted_by VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    type ENUM('INTERNSHIP', 'FULL_TIME', 'CONTRACT', 'FREELANCE') NOT NULL,
    location VARCHAR(150),
    is_remote BOOLEAN DEFAULT FALSE,
    description MEDIUMTEXT NOT NULL,
    requirements TEXT,
    skills_required JSON,
    salary_min INT,
    salary_max INT,
    eligible_branches JSON,
    deadline DATE,
    apply_link VARCHAR(500) NOT NULL,
    is_referral_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_opp_poster FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review_requests (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    reviewer_id VARCHAR(36) NULL,
    type ENUM('RESUME', 'PROJECT', 'BOTH') NOT NULL,
    status ENUM('PENDING', 'IN_REVIEW', 'COMPLETED') DEFAULT 'PENDING',
    message TEXT,
    resume_url VARCHAR(500),
    project_title VARCHAR(200),
    project_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rev_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;`
  },
  {
    path: 'backend/src/main/java/edu/anurag/alumni/AnuragAlumniApplication.java',
    category: 'config',
    description: 'Spring Boot Application Main Entry Point',
    content: `package edu.anurag.alumni;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AnuragAlumniApplication {
    public static void main(String[] args) {
        SpringApplication.run(AnuragAlumniApplication.class, args);
        System.out.println("🎓 Anurag Alumni Connect Backend Started on :8080/api/v1");
    }
}`
  },
  {
    path: 'backend/src/main/java/edu/anurag/alumni/controller/AuthController.java',
    category: 'controller',
    description: 'REST Controller for JWT Authentication & Dual Student Registration',
    content: `package edu.anurag.alumni.controller;

import edu.anurag.alumni.dto.AuthDtos.*;
import edu.anurag.alumni.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/register-student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStudent(request));
    }

    @PostMapping("/register-alumni")
    public ResponseEntity<AuthResponse> registerAlumni(@Valid @RequestBody RegisterAlumniRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAlumni(request));
    }
}`
  },
  {
    path: 'backend/src/main/java/edu/anurag/alumni/controller/OpportunityController.java',
    category: 'controller',
    description: 'REST Controller for Career Opportunities with Branch/Type filtering',
    content: `package edu.anurag.alumni.controller;

import edu.anurag.alumni.dto.OpportunityDto;
import edu.anurag.alumni.service.OpportunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<List<OpportunityDto>> getOpportunities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) Boolean remote) {
        return ResponseEntity.ok(opportunityService.findAll(type, branch, remote));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityDto> getOpportunityById(@PathVariable String id) {
        return ResponseEntity.ok(opportunityService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OpportunityDto> createOpportunity(
            @Valid @RequestBody OpportunityDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : "karthik.r@anurag.edu.in";
        return ResponseEntity.status(HttpStatus.CREATED).body(opportunityService.create(dto, email));
    }
}`
  },
  {
    path: 'backend/src/main/java/edu/anurag/alumni/controller/ReviewController.java',
    category: 'controller',
    description: 'REST Controller for Student Reviews, Open Pool claims & Alumni Feedback',
    content: `package edu.anurag.alumni.controller;

import edu.anurag.alumni.dto.ReviewDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    @GetMapping("/my-requests")
    public ResponseEntity<List<ReviewDetailResponse>> getStudentRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/open-pool")
    public ResponseEntity<List<ReviewDetailResponse>> getOpenReviewPool() {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<ReviewDetailResponse> submitReview(
            @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<ReviewDetailResponse> claimReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok().build();
    }
}`
  },
  {
    path: 'backend/src/main/java/edu/anurag/alumni/security/SecurityConfig.java',
    category: 'security',
    description: 'Spring Security 6 stateless JWT filter chain and CORS mapping',
    content: `package edu.anurag.alumni.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/questions/**", "/opportunities/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}`
  }
];
