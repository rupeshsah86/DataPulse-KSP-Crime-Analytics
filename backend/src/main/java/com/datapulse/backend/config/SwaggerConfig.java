package com.datapulse.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI Configuration
 *
 * This configuration enables API documentation for DataPulse.
 *
 * Access Swagger UI at: http://localhost:8082/swagger-ui/index.html
 * Access OpenAPI JSON at: http://localhost:8082/v3/api-docs
 *
 * Features:
 * - JWT Authentication support in Swagger UI
 * - Professional API documentation
 * - All endpoints documented automatically
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createSecurityScheme()))
                .info(new Info()
                        .title("DataPulse - AI-Driven Crime Analytics API")
                        .description("""
                                DataPulse is an AI-powered crime analytics platform for police departments.
                                
                                ## Authentication
                                All endpoints except `/api/v1/auth/**` require JWT authentication.
                                
                                ### How to Authenticate:
                                1. Register a new user at `/api/v1/auth/register`
                                2. Login at `/api/v1/auth/login` to get a JWT token
                                3. Click the **Authorize** button above and enter: `Bearer <your-token>`
                                
                                ## Features
                                - Crime CRUD operations
                                - JWT Authentication
                                - File upload (CSV/Excel)
                                - Dashboard statistics
                                - Search and filtering
                                
                                ## Roles
                                - **ADMIN**: Full system access
                                - **OFFICER**: Manage crime records
                                - **ANALYST**: View analytics and reports
                                - **INVESTIGATOR**: Manage investigations
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("DataPulse Team")
                                .email("support@datapulse.com")
                                .url("https://github.com/yourusername/DataPulse-KSP-Crime-Analytics"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }

    private SecurityScheme createSecurityScheme() {
        return new SecurityScheme()
                .name("Bearer Authentication")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Enter your JWT token as: Bearer <your-token>");
    }
}