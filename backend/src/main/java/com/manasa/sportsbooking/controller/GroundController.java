package com.manasa.sportsbooking.controller;

import com.manasa.sportsbooking.dto.response.GroundResponse;
import com.manasa.sportsbooking.enums.SportType;
import com.manasa.sportsbooking.service.GroundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grounds")
public class GroundController {

    private final GroundService groundService;

    public GroundController(GroundService groundService) {
        this.groundService = groundService;
    }

    @GetMapping
    public ResponseEntity<List<GroundResponse>> getAllGrounds() {
        return ResponseEntity.ok(groundService.getAllGrounds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroundResponse> getGroundById(@PathVariable Long id) {
        return ResponseEntity.ok(groundService.getGroundById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<GroundResponse>> getGroundsByFilter(
            @RequestParam(required = false) SportType sportType,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(groundService.getGroundsByFilter(sportType, location));
    }
}