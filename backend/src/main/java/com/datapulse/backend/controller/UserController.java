package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.User;
import com.datapulse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.containsKey("fullName") && request.get("fullName") != null) {
            user.setFullName(request.get("fullName"));
        }
        if (request.containsKey("phoneNumber") && request.get("phoneNumber") != null) {
            user.setPhoneNumber(request.get("phoneNumber"));
        }
        if (request.containsKey("policeStation") && request.get("policeStation") != null) {
            user.setPoliceStation(request.get("policeStation"));
        }

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Current password is incorrect");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }
}