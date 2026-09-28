package com.ridesharelite.ridesharelite.repository;

import com.ridesharelite.ridesharelite.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}