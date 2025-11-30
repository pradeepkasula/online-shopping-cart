package com.example.userservice.controller;

import com.example.userservice.model.User;
import com.example.userservice.security.JwtUtil;
import com.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        User saved = userService.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        if (user.isRequirePasswordChange()) {
            return ResponseEntity.status(403).body(Map.of("error", "Password change required"));
        }
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        String tempPassword = userService.generateTempPassword(user);
        return ResponseEntity.ok(Map.of("tempPassword", tempPassword));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String tempPassword = req.get("tempPassword");
        String newPassword = req.get("newPassword");
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        if (!userService.validateTempPassword(user, tempPassword)) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid or expired temp password"));
        }
        userService.changePassword(user, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "phone", user.getPhone()
        ));
    }
}
