package com.manasa.sportsbooking.service;

import com.manasa.sportsbooking.dto.request.LoginRequest;
import com.manasa.sportsbooking.dto.request.RegisterRequest;
import com.manasa.sportsbooking.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}