package com.vesselguard.service;

import com.vesselguard.dto.AuthResponse;
import com.vesselguard.dto.LoginRequest;
import com.vesselguard.dto.RegisterRequest;
import com.vesselguard.entity.User;
import com.vesselguard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        if (!StringUtils.hasText(request.getFullName())
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getPassword())) {
            throw new RuntimeException("All fields are required");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setId(saved.getId());
        response.setFullName(saved.getFullName());
        response.setEmail(saved.getEmail());
        response.setMessage("Registration successful");
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");
        return response;
    }
}
