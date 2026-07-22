package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository
 *
 * Handles database operations for User entities.
 *
 * Professional Note: JpaRepository provides:
 * - save(), findById(), findAll(), deleteById()
 * - count(), existsById()
 * - Pagination and sorting support
 *
 * Custom methods:
 * - findByEmail(): Find user by email (used for login)
 * - existsByEmail(): Check if email already registered
 * - findByEmployeeId(): Find user by employee ID
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email (used for authentication)
     *
     * @param email User's email address
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email already exists in database
     * Used during registration to prevent duplicate emails
     *
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find user by employee ID
     *
     * @param employeeId Employee ID
     * @return Optional containing user if found
     */
    //Optional<User> findByEmployeeId(String employeeId);
}