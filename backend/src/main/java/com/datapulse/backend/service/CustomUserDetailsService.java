package com.datapulse.backend.service;

import com.datapulse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetails Service
 *
 * This service is used by Spring Security to load user details during authentication.
 *
 * How it works:
 * 1. When a user tries to login, Spring Security calls this service
 * 2. This service loads the user from the database by email
 * 3. Returns UserDetails object (our User entity implements this)
 * 4. Spring Security compares the password
 *
 * Professional Note: This is a critical part of Spring Security.
 * Without this, Spring Security cannot authenticate users.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by email (username)
     *
     * @param email User's email address
     * @return UserDetails object (our User entity)
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}