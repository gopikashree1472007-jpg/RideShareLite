package com.ridesharelite.ridesharelite.controller;

import com.ridesharelite.ridesharelite.entity.Ride;
import com.ridesharelite.ridesharelite.repository.RideRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideRepository rideRepository;

    public RideController(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    // Create a new ride
    @PostMapping
    public Ride createRide(@RequestBody Ride ride) {
        return rideRepository.save(ride);
    }

    // Get all rides
    @GetMapping
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // Get ride by ID
    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRideById(@PathVariable Long id) {

        return rideRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search rides
    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination) {

        return rideRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCase(
                        source,
                        destination
                );
    }

    // Delete ride
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id) {

        if (!rideRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        rideRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}