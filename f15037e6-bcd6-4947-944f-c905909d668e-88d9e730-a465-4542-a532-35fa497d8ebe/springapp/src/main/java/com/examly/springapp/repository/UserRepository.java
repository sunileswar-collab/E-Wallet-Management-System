package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.examly.springapp.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    default Optional<User> findByUsername(String username) {
        return findByEmail(username);
    }
    default boolean existsByUsername(String username) {
        return existsByEmail(username);
    }
}
