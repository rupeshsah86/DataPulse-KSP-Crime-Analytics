package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.User;
import com.datapulse.backend.entity.com.datapulse.enums.Role;
import com.datapulse.backend.repository.UserRepository;
import com.datapulse.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller
 *
 * Handles:
 * - User Registration
 * - User Login
 * - Token generation
 *
 * Professional Note: This is the entry point for all authentication requests.
 * All endpoints here are PUBLIC (no authentication required).
 *
 * Endpoints:
 * POST /api/v1/auth/register - Register a new user
 * POST /api/v1/auth/login - Login and get JWT token
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * User Login
     * POST /api/v1/auth/login
     *
     * Request Body:
     * {
     *     "email": "officer@police.com",
     *     "password": "password123"
     * }
     *
     * Response:
     * {
     *     "token": "eyJhbGciOiJIUzI1NiIs...",
     *     "email": "officer@police.com",
     *     "role": "OFFICER",
     *     "fullName": "Officer Ravi"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        // Authenticate user using Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(authentication);

        // Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build response
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("fullName", user.getFullName());

        return ResponseEntity.ok(response);
    }

    /**
     * User Registration
     * POST /api/v1/auth/register
     *
     * Request Body:
     * {
     *     "fullName": "Officer Ravi",
     *     "email": "ravi@police.com",
     *     "password": "password123",
     *     "employeeId": "EMP001",
     *     "policeStation": "City Center",
     *     "phoneNumber": "9876543210",
     *     "role": "OFFICER"
     * }
     *
     * Response:
     * {
     *     "message": "User registered successfully",
     *     "email": "ravi@police.com",
     *     "role": "OFFICER"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Email already registered");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Create new user
        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .employeeId(registerRequest.getEmployeeId())
                .policeStation(registerRequest.getPoliceStation())
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(registerRequest.getRole())
                .isActive(true)
                .isLocked(false)
                .build();

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================
    // INNER CLASSES FOR REQUEST BODIES
    // ============================================

    /**
     * Login Request DTO
     */
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    /**
     * Register Request DTO
     */
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private String employeeId;
        private String policeStation;
        private String phoneNumber;
        private Role role;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmployeeId() { return employeeId; }
        public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
        public String getPoliceStation() { return policeStation; }
        public void setPoliceStation(String policeStation) { this.policeStation = policeStation; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }
}