package com.datapulse.backend.config;

import com.datapulse.backend.security.JwtAuthenticationEntryPoint;
import com.datapulse.backend.security.JwtAuthenticationFilter;
import com.datapulse.backend.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ Public endpoints (NO authentication required)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()  // ✅ H2 Console

                        // ✅ Swagger UI (API documentation)
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/swagger-resources/**",
                                "/swagger-resources",
                                "/webjars/**"
                        ).permitAll()

                        // ✅ USER ENDPOINTS - Settings page
                        .requestMatchers("/api/v1/users/**").authenticated()

                        // ✅ PDF REPORTS
                        .requestMatchers("/api/v1/reports/**").authenticated()

                        // ✅ AI ENDPOINTS
                        .requestMatchers("/api/v1/ai/**").authenticated()

                        // ✅ OFFICER PERFORMANCE
                        .requestMatchers("/api/v1/officers/**").authenticated()

                        // ✅ REPEAT OFFENDERS
                        .requestMatchers("/api/v1/offenders/**").authenticated()

                        // ✅ CRIMINAL NETWORK
                        .requestMatchers("/api/v1/criminals/**").authenticated()

                        // ✅ ADMIN only endpoints
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // ✅ OFFICER, ADMIN, ANALYST, INVESTIGATOR
                        .requestMatchers("/api/v1/crimes/**").hasAnyRole("ADMIN", "OFFICER", "ANALYST", "INVESTIGATOR")

                        // ✅ ANALYST and ADMIN
                        .requestMatchers("/api/v1/analytics/**").hasAnyRole("ADMIN", "ANALYST")

                        // ✅ All other requests need authentication
                        .anyRequest().authenticated()
                )
                // ✅ Disable CSRF for H2 Console
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://frontend-deploy-wfmnamam.onslate.in"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}