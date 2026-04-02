package com.manasa.sportsbooking.controller;

import com.manasa.sportsbooking.dto.request.GroundRequest;
import com.manasa.sportsbooking.dto.request.UserStatusUpdateRequest;
import com.manasa.sportsbooking.dto.response.GroundResponse;
import com.manasa.sportsbooking.dto.response.UserResponse;
import com.manasa.sportsbooking.service.GroundService;
import com.manasa.sportsbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private GroundService groundService;

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{userId}/status")
    public UserResponse updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        return userService.updateUserStatus(userId, request.getEnabled());
    }

    @PostMapping("/grounds")
    public GroundResponse createGround(@Valid @RequestBody GroundRequest request) {
        return groundService.createGround(request);
    }
}