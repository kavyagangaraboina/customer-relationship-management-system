package com.crm.service;

import com.crm.dto.AuthRequest;
import com.crm.dto.AuthResponse;
import com.crm.dto.RegisterRequest;
import com.crm.entity.User;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "Username is already taken", null, null);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email is already registered", null, null);
        }

        User newUser = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                "ROLE_USER"
        );

        userRepository.save(newUser);

        return new AuthResponse(true, "Registration successful! Please log in.", newUser.getUsername(), newUser.getFullName());
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsername());
        }

        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid username/email or password", null, null);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid username/email or password", null, null);
        }

        return new AuthResponse(true, "Login successful", user.getUsername(), user.getFullName());
    }
}
