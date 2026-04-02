package com.manasa.sportsbooking.service.impl;

import com.manasa.sportsbooking.dto.request.LoginRequest;
import com.manasa.sportsbooking.dto.request.RegisterRequest;
import com.manasa.sportsbooking.dto.response.AuthResponse;
import com.manasa.sportsbooking.dto.response.UserResponse;
import com.manasa.sportsbooking.entity.User;
import com.manasa.sportsbooking.enums.Role;
import com.manasa.sportsbooking.repository.UserRepository;
import com.manasa.sportsbooking.security.JwtUtil;
import com.manasa.sportsbooking.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setRole(Role.USER);
            user.setEnabled(true);
            user.setCreatedAt(LocalDateTime.now());

            user = userRepository.save(user);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(authentication);

            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setFullName(user.getFullName());
            userResponse.setEmail(user.getEmail());
            userResponse.setPhone(user.getPhone());
            userResponse.setRole(user.getRole());
            userResponse.setEnabled(user.getEnabled());
            userResponse.setCreatedAt(user.getCreatedAt());

            return new AuthResponse(token, userResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Register failed: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            System.out.println("LOGIN ATTEMPT: " + request.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            System.out.println("AUTH SUCCESS: " + authentication.getName());

            String token = jwtUtil.generateToken(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setFullName(user.getFullName());
            userResponse.setEmail(user.getEmail());
            userResponse.setPhone(user.getPhone());
            userResponse.setRole(user.getRole());
            userResponse.setEnabled(user.getEnabled());
            userResponse.setCreatedAt(user.getCreatedAt());

            return new AuthResponse(token, userResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }
}