package com.manasa.sportsbooking.service.impl;

import com.manasa.sportsbooking.dto.request.GroundRequest;
import com.manasa.sportsbooking.dto.response.GroundResponse;
import com.manasa.sportsbooking.entity.Ground;
import com.manasa.sportsbooking.enums.SportType;
import com.manasa.sportsbooking.repository.GroundRepository;
import com.manasa.sportsbooking.service.GroundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroundServiceImpl implements GroundService {

    @Autowired
    private GroundRepository groundRepository;

    @Override
    public GroundResponse createGround(GroundRequest request) {
        Ground ground = new Ground();
        ground.setName(request.getName());
        ground.setLocation(request.getLocation());
        ground.setSportType(request.getSportType() != null ? request.getSportType().toString() : null);
        ground.setPricePerHour(request.getPricePerHour());
        ground.setDescription(request.getDescription());
        ground.setImageUrl(request.getImageUrl());
        ground.setAvailable(request.getAvailable());

        Ground savedGround = groundRepository.save(ground);
        return mapToGroundResponse(savedGround);
    }

    @Override
    public List<GroundResponse> getAllGrounds() {
        return groundRepository.findAll()
                .stream()
                .map(this::mapToGroundResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GroundResponse getGroundById(Long id) {
        Ground ground = groundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ground not found with id: " + id));
        return mapToGroundResponse(ground);
    }

    @Override
    public List<GroundResponse> getGroundsByFilter(SportType sportType, String location) {
        return groundRepository.findAll()
                .stream()
                .filter(g -> sportType == null || g.getSportType().equalsIgnoreCase(sportType.name()))
                .filter(g -> location == null || location.isBlank() || g.getLocation().equalsIgnoreCase(location))
                .map(this::mapToGroundResponse)
                .collect(Collectors.toList());
    }

    private GroundResponse mapToGroundResponse(Ground ground) {
        GroundResponse response = new GroundResponse();
        response.setId(ground.getId());
        response.setName(ground.getName());
        response.setLocation(ground.getLocation());
        response.setSportType(ground.getSportType());
        response.setPricePerHour(ground.getPricePerHour());
        response.setDescription(ground.getDescription());
        response.setImageUrl(ground.getImageUrl());
        response.setAvailable(ground.getAvailable());
        return response;
    }
}