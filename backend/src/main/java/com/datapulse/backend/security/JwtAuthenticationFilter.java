package com.datapulse.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(1)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    // ✅ ONLY these paths are PUBLIC (no JWT required)
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
            "/api/v1/auth/",      // Login and Register
            "/actuator/health",   // Health check
            "/swagger-ui/",       // API Documentation
            "/v3/api-docs/",      // OpenAPI docs
            "/swagger-resources/" // Swagger resources
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Log for debugging
        System.out.println("🔍 JWT Filter - Path: " + path);

        // Skip JWT validation for public paths ONLY
        for (String publicPath : PUBLIC_PATHS) {
            if (path.startsWith(publicPath)) {
                System.out.println("🔓 PUBLIC PATH - Skipping JWT for: " + path);
                return true;
            }
        }

        System.out.println("🔒 PROTECTED PATH - JWT required for: " + path);
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ No JWT token found in request for: " + request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtTokenProvider.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ JWT validated for: " + userEmail);
            } else {
                System.out.println("❌ Invalid JWT token for: " + userEmail);
            }
        }

        filterChain.doFilter(request, response);
    }
}