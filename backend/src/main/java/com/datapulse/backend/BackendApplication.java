package com.datapulse.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * DataPulse Backend Application
 *
 * Main entry point for the Spring Boot application.
 *
 * @SpringBootApplication → Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
 * @EnableJpaAuditing → Enables JPA auditing (createdBy, createdAt, etc.)
 *
 * Why @EnableJpaAuditing?
 * - Required for @CreatedBy, @LastModifiedBy to work
 * - Enables automatic timestamp management
 * - Professional auditing capabilities
 */
@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}