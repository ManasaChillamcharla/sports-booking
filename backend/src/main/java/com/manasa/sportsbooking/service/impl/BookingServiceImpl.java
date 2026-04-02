package com.manasa.sportsbooking.service.impl;

import com.manasa.sportsbooking.dto.request.BookingRequest;
import com.manasa.sportsbooking.dto.response.BookingResponse;
import com.manasa.sportsbooking.dto.response.GroundResponse;
import com.manasa.sportsbooking.dto.response.UserResponse;
import com.manasa.sportsbooking.entity.Booking;
import com.manasa.sportsbooking.entity.Ground;
import com.manasa.sportsbooking.entity.User;
import com.manasa.sportsbooking.enums.BookingStatus;
import com.manasa.sportsbooking.repository.BookingRepository;
import com.manasa.sportsbooking.repository.GroundRepository;
import com.manasa.sportsbooking.repository.UserRepository;
import com.manasa.sportsbooking.service.BookingService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final GroundRepository groundRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              GroundRepository groundRepository,
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.groundRepository = groundRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ground ground = groundRepository.findById(request.getGroundId())
                .orElseThrow(() -> new RuntimeException("Ground not found"));

        if (!Boolean.TRUE.equals(ground.getAvailable())) {
            throw new RuntimeException("Ground is not available");
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                ground.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                BookingStatus.CANCELLED
        );

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Time slot is already booked");
        }

        long hours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        BigDecimal totalPrice = BigDecimal.valueOf(ground.getPricePerHour())
        .multiply(BigDecimal.valueOf(hours));
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setGround(ground);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);
        return mapToBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        return mapToBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking = bookingRepository.save(booking);
        return mapToBookingResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not pending");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking = bookingRepository.save(booking);
        return mapToBookingResponse(booking);
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(booking.getUser().getId());
        userResponse.setFullName(booking.getUser().getFullName());
        userResponse.setEmail(booking.getUser().getEmail());
        userResponse.setPhone(booking.getUser().getPhone());
        userResponse.setRole(booking.getUser().getRole());
        userResponse.setEnabled(booking.getUser().getEnabled());
        userResponse.setCreatedAt(booking.getUser().getCreatedAt());

        GroundResponse groundResponse = new GroundResponse();
        groundResponse.setId(booking.getGround().getId());
        groundResponse.setName(booking.getGround().getName());
        groundResponse.setSportType(booking.getGround().getSportType());
        groundResponse.setLocation(booking.getGround().getLocation());
        groundResponse.setDescription(booking.getGround().getDescription());
        groundResponse.setPricePerHour(booking.getGround().getPricePerHour());
        groundResponse.setImageUrl(booking.getGround().getImageUrl());
        groundResponse.setAvailable(booking.getGround().getAvailable());

        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUser(userResponse);
        response.setGround(groundResponse);
        response.setBookingDate(booking.getBookingDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());

        return response;
    }
}