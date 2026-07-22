package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.User;
import com.datapulse.backend.entity.com.datapulse.enums.Role;
import com.datapulse.backend.repository.UserRepository;
import com.datapulse.backend.security.JwtTokenProvider;
import com.datapulse.backend.service.EmailService;
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

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("fullName", user.getFullName());
        response.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
        response.put("lastName", user.getLastName() != null ? user.getLastName() : "");
        response.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        response.put("policeStation", user.getPoliceStation() != null ? user.getPoliceStation() : "");
        response.put("badgeNumber", user.getBadgeNumber() != null ? user.getBadgeNumber() : "");
        response.put("department", user.getDepartment() != null ? user.getDepartment() : "");
        response.put("rankName", user.getRankName() != null ? user.getRankName() : "");
        response.put("district", user.getDistrict() != null ? user.getDistrict() : "");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Email already registered");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .badgeNumber(registerRequest.getBadgeNumber())
                .department(registerRequest.getDepartment())
                .rankName(registerRequest.getRankName())
                .policeStation(registerRequest.getPoliceStation())
                .district(registerRequest.getDistrict())
                .role(registerRequest.getRole())
                .isActive(true)
                .isLocked(false)
                .build();

        userRepository.save(user);

        emailService.sendWelcomeEmail(
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String phoneNumber;
        private String badgeNumber;
        private String department;
        private String rankName;
        private String policeStation;
        private String district;
        private Role role;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getBadgeNumber() { return badgeNumber; }
        public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getRankName() { return rankName; }
        public void setRankName(String rankName) { this.rankName = rankName; }
        public String getPoliceStation() { return policeStation; }
        public void setPoliceStation(String policeStation) { this.policeStation = policeStation; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }
}