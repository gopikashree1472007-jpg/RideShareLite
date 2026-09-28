package com.ridesharelite.ridesharelite.repository;

import com.ridesharelite.ridesharelite.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source,
            String destination
    );
}
