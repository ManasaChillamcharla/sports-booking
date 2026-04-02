package com.manasa.sportsbooking.service;

import com.manasa.sportsbooking.dto.request.GroundRequest;
import com.manasa.sportsbooking.dto.response.GroundResponse;
import com.manasa.sportsbooking.enums.SportType;

import java.util.List;

public interface GroundService {

    GroundResponse createGround(GroundRequest request);

    List<GroundResponse> getAllGrounds();

    GroundResponse getGroundById(Long id);

    List<GroundResponse> getGroundsByFilter(SportType sportType, String location);
}