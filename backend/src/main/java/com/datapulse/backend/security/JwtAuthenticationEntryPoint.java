package com.datapulse.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * JWT Authentication Entry Point
 *
 * Handles unauthorized access attempts
 * Returns 401 Unauthorized when authentication fails
 *
 * Professional Note: This is where unauthorized requests are handled.
 * Instead of redirecting to a login page (like in a web app),
 * we return a 401 JSON response for REST APIs.
 *
 * What triggers this?
 * - Missing JWT token
 * - Invalid JWT token
 * - Expired JWT token
 * - No authentication credentials
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        // Set HTTP status to 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Set content type to JSON
        response.setContentType("application/json");

        // Write error response
        response.getWriter().write(
                String.format(
                        "{\"error\": \"Unauthorized\", \"message\": \"%s\"}",
                        authException.getMessage()
                )
        );
    }
}