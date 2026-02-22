package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.Role;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String name, String email, String string) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(name));
        user.setRole(Role.USER);
        
        User savedUser = userRepository.save(user);
        
        // Create wallet for the user
        Wallet wallet = new Wallet(savedUser);
        walletRepository.save(wallet);
        
        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public Page<User> getAllUsers(int page, int size, String sortBy, String sortDir, String filterBy, String filterValue) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<User> spec = (root, query, criteriaBuilder) -> {
            if (filterBy != null && filterValue != null && !filterValue.isEmpty()) {
                if ("name".equals(filterBy)) {
                    return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + filterValue.toLowerCase() + "%");
                } else if ("email".equals(filterBy)) {
                    return criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + filterValue.toLowerCase() + "%");
                }
            }
            return criteriaBuilder.conjunction();
        };

        return userRepository.findAll(spec, pageable);
    }
}
