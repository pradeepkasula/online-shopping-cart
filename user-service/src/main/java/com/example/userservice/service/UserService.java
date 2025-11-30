package com.example.userservice.service;

import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        String originalPassword = user.getPasswordHash();
        user.setPasswordOriginal(originalPassword);
        user.setPasswordHash(passwordEncoder.encode(originalPassword));
        user.setRequirePasswordChange(false);
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPasswordHash());
    }

    public String generateTempPassword(User user) {
        String temp = UUID.randomUUID().toString().substring(0, 8);
        user.setTempPassword(passwordEncoder.encode(temp));
        user.setTempPasswordExpiry(LocalDateTime.now().plusMinutes(15));
        user.setRequirePasswordChange(true);
        userRepository.save(user);
        return temp;
    }

    public boolean validateTempPassword(User user, String tempPassword) {
        if (user.getTempPassword() == null || user.getTempPasswordExpiry() == null) return false;
        if (user.getTempPasswordExpiry().isBefore(LocalDateTime.now())) return false;
        return passwordEncoder.matches(tempPassword, user.getTempPassword());
    }

    public void changePassword(User user, String newPassword) {
        user.setPasswordOriginal(newPassword);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setTempPassword(null);
        user.setTempPasswordExpiry(null);
        user.setRequirePasswordChange(false);
        userRepository.save(user);
    }
}
