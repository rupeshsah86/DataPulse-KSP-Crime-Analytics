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

        if (request.containsKey("firstName") && request.get("firstName") != null) {
            user.setFirstName(request.get("firstName"));
        }
        if (request.containsKey("lastName") && request.get("lastName") != null) {
            user.setLastName(request.get("lastName"));
        }
        if (request.containsKey("phoneNumber") && request.get("phoneNumber") != null) {
            user.setPhoneNumber(request.get("phoneNumber"));
        }
        if (request.containsKey("badgeNumber") && request.get("badgeNumber") != null) {
            user.setBadgeNumber(request.get("badgeNumber"));
        }
        if (request.containsKey("department") && request.get("department") != null) {
            user.setDepartment(request.get("department"));
        }
        if (request.containsKey("rankName") && request.get("rankName") != null) {
            user.setRankName(request.get("rankName"));
        }
        if (request.containsKey("policeStation") && request.get("policeStation") != null) {
            user.setPoliceStation(request.get("policeStation"));
        }
        if (request.containsKey("district") && request.get("district") != null) {
            user.setDistrict(request.get("district"));
        }

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
        response.put("lastName", user.getLastName() != null ? user.getLastName() : "");
        response.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        response.put("badgeNumber", user.getBadgeNumber() != null ? user.getBadgeNumber() : "");
        response.put("department", user.getDepartment() != null ? user.getDepartment() : "");
        response.put("rankName", user.getRankName() != null ? user.getRankName() : "");
        response.put("policeStation", user.getPoliceStation() != null ? user.getPoliceStation() : "");
        response.put("district", user.getDistrict() != null ? user.getDistrict() : "");
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

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Current password is incorrect");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }
}