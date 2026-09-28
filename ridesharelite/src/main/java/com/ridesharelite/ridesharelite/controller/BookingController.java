package com.ridesharelite.ridesharelite.controller;

import com.ridesharelite.ridesharelite.entity.Booking;
import com.ridesharelite.ridesharelite.entity.Ride;
import com.ridesharelite.ridesharelite.repository.BookingRepository;
import com.ridesharelite.ridesharelite.repository.RideRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;

    public BookingController(
            BookingRepository bookingRepository,
            RideRepository rideRepository) {

        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
    }

    // Create booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        if (booking.getSeatsBooked() <= 0) {
            return ResponseEntity.badRequest()
                    .body("Seats booked must be greater than 0");
        }

        Ride ride = rideRepository.findById(booking.getRideId())
                .orElse(null);

        if (ride == null) {
            return ResponseEntity.badRequest()
                    .body("Ride not found");
        }

        if (booking.getSeatsBooked() > ride.getAvailableSeats()) {
            return ResponseEntity.badRequest()
                    .body("Not enough seats available");
        }

        ride.setAvailableSeats(
                ride.getAvailableSeats() - booking.getSeatsBooked()
        );

        rideRepository.save(ride);

        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get bookings of a user
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(
            @PathVariable Long userId) {

        return bookingRepository.findByUserId(userId);
    }

    // Cancel booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            return ResponseEntity.badRequest()
                    .body("Booking is already cancelled");
        }

        Ride ride = rideRepository.findById(booking.getRideId())
                .orElse(null);

        if (ride != null) {
            ride.setAvailableSeats(
                    ride.getAvailableSeats() + booking.getSeatsBooked()
            );

            rideRepository.save(ride);
        }

        booking.setStatus("CANCELLED");

        return ResponseEntity.ok(
                bookingRepository.save(booking)
        );
    }
}