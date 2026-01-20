package com.smarttransport.authservice.controller;

import com.smarttransport.authservice.dto.AuthResponse;
import com.smarttransport.authservice.dto.LoginRequest;
import com.smarttransport.authservice.dto.RegisterRequest;
import com.smarttransport.authservice.dto.UserResponse;
import com.smarttransport.authservice.dto.UserUpdateRequest;
import com.smarttransport.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.getUsername(), request.getPassword());
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return authService.getByUsername(authentication.getName());
    }

    @GetMapping("/users")
    public java.util.List<UserResponse> list(Authentication authentication) {
        requireAdmin(authentication);
        return authService.listUsers();
    }

    @PutMapping("/users/{id}")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request, Authentication authentication) {
        ensureOwnerOrAdmin(id, authentication);
        return authService.updateUser(id, request);
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        ensureOwnerOrAdmin(id, authentication);
        authService.deleteUser(id);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Auth service Tunisia is running";
    }

    private void ensureOwnerOrAdmin(Long id, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return;
        UserResponse me = authService.getByUsername(authentication.getName());
        if (!me.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }
}
