package com.manasa.sportsbooking.repository;

import com.manasa.sportsbooking.entity.Booking;
import com.manasa.sportsbooking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("""
           SELECT b FROM Booking b
           WHERE b.ground.id = :groundId
           AND b.bookingDate = :bookingDate
           AND b.status <> :excludedStatus
           AND (
                :startTime < b.endTime
                AND :endTime > b.startTime
           )
           """)
    List<Booking> findOverlappingBookings(Long groundId,
                                          LocalDate bookingDate,
                                          LocalTime startTime,
                                          LocalTime endTime,
                                          BookingStatus excludedStatus);
}