package com.manasa.sportsbooking.service;

import com.manasa.sportsbooking.dto.response.UserResponse;
import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse updateUserStatus(Long userId, Boolean enabled);

    UserResponse getCurrentUser();
}