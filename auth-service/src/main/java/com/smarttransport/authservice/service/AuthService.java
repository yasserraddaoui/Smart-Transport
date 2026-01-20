package com.smarttransport.authservice.service;

import com.smarttransport.authservice.domain.AppUser;
import com.smarttransport.authservice.domain.UserRole;
import com.smarttransport.authservice.dto.AuthResponse;
import com.smarttransport.authservice.dto.UserResponse;
import com.smarttransport.authservice.dto.UserUpdateRequest;
import com.smarttransport.authservice.dto.RegisterRequest;
import com.smarttransport.authservice.repository.UserRepository;
import com.smarttransport.authservice.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.Objects;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(String username, String password) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getFullName(), user.getCity());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        UserRole role = request.getRole();
        AppUser user = new AppUser(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getFullName(),
                request.getCity()
        );
        AppUser saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole().name());
        return new AuthResponse(token, saved.getUsername(), saved.getRole().name(), saved.getFullName(), saved.getCity());
    }

    public UserResponse getByUsername(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateUser(@NonNull Long id, UserUpdateRequest request) {
        Long safeId = requireId(id);
        AppUser user = userRepository.findById(safeId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setFullName(request.getFullName());
        user.setCity(request.getCity());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        AppUser saved = userRepository.save(user);
        return toResponse(saved);
    }

    public void deleteUser(@NonNull Long id) {
        Long safeId = requireId(id);
        if (!userRepository.existsById(safeId)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(safeId);
    }

    public java.util.List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(AuthService::toResponse).toList();
    }

    private static UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getCity(),
                user.getCreatedAt()
        );
    }

    private static @NonNull Long requireId(@NonNull Long id) {
        return Objects.requireNonNull(id, "User id is required");
    }
}
