package org.example.calendar.service;

import lombok.AllArgsConstructor;
import org.example.calendar.entity.User;
import org.example.calendar.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Optional<User> getUserById(int userId) {
        return userRepository.findById(userId);
    }
}
