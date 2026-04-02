package com.manasa.sportsbooking.service;

import com.manasa.sportsbooking.dto.request.BookingRequest;
import com.manasa.sportsbooking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    List<BookingResponse> getMyBookings();

    BookingResponse cancelBooking(Long id);

    List<BookingResponse> getAllBookings();

    BookingResponse approveBooking(Long id);

    BookingResponse rejectBooking(Long id);
}