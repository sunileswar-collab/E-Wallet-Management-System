package com.examly.springapp.controller;

import com.examly.springapp.model.RevokedToken;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.RevokedTokenRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtUtil;
import com.examly.springapp.service.UserService;
import com.examly.springapp.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }

    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private RevokedTokenRepository revokedTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserService userService;

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getName() == null || user.getName().trim().isEmpty() || 
            user.getEmail() == null || user.getEmail().trim().isEmpty() || 
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name, email and password are required.");
        }

        try {
            User newUser = userService.createUser(user.getName(), user.getEmail(), user.getPassword());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully!");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    /**
     * Login user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() || 
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            User u = existingUser.get();
            if (passwordEncoder.matches(user.getPassword(), u.getPassword())) {
                if (u.getRole() == null) {
                    u.setRole(Role.USER);
                    userRepository.save(u);
                }

                return ResponseEntity.ok(Map.of(
                        "accessToken", jwtUtil.generateToken(u.getEmail(), u.getRole().name()),
                        "refreshToken", jwtUtil.generateRefreshToken(u.getEmail(), u.getRole().name()),
                        "user", Map.of(
                            "userId", u.getUserId(),
                            "name", u.getName(),
                            "email", u.getEmail(),
                            "role", u.getRole().name()
                        )
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    /**
     * Logout (invalidate tokens)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody(required = false) Map<String, String> request) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid Authorization header.");
        }

        token = token.substring(7);
        revokedTokenRepository.save(new RevokedToken(token));

        if (request != null) {
            String refreshToken = request.get("refreshToken");
            if (refreshToken != null) {
                revokedTokenRepository.save(new RevokedToken(refreshToken));
            }
        }

        return ResponseEntity.ok("Logged out successfully.");
    }

    /**
     * Refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        if (request == null || !request.containsKey("refreshToken")) {
            return ResponseEntity.badRequest().body("Refresh token is required.");
        }

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired refresh token.");
        }

        String email = jwtUtil.getUsernameFromToken(refreshToken);
        String role = jwtUtil.getRoleFromToken(refreshToken);

        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found.");
        }

        return ResponseEntity.ok(Map.of(
                "accessToken", jwtUtil.generateToken(email, role)
        ));
    }
}
