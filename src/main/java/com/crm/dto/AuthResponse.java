package com.crm.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String username;
    private String fullName;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, String username, String fullName) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.fullName = fullName;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
