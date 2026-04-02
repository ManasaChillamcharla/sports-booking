package com.manasa.sportsbooking.repository;

import com.manasa.sportsbooking.entity.Ground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroundRepository extends JpaRepository<Ground, Long> {
}