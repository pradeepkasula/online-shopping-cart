package com.example.userservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(name = "password_original")
    private String passwordOriginal;

    @Column(nullable = false)
    private String email;

    private String fullName;
    private String phone;
    private String tempPassword;
    private LocalDateTime tempPasswordExpiry;
    private boolean requirePasswordChange;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordOriginal() {
        return passwordOriginal;
    }

    public void setPasswordOriginal(String passwordOriginal) {
        this.passwordOriginal = passwordOriginal;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }

    public LocalDateTime getTempPasswordExpiry() {
        return tempPasswordExpiry;
    }

    public void setTempPasswordExpiry(LocalDateTime tempPasswordExpiry) {
        this.tempPasswordExpiry = tempPasswordExpiry;
    }

    public boolean isRequirePasswordChange() {
        return requirePasswordChange;
    }

    public void setRequirePasswordChange(boolean requirePasswordChange) {
        this.requirePasswordChange = requirePasswordChange;
    }
}
