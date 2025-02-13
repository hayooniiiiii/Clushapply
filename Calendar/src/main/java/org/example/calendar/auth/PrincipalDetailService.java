package org.example.calendar.auth;

import org.example.calendar.entity.User;
import org.example.calendar.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PrincipalDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    public PrincipalDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //시큐리티 session = 내부 authentication=내부 userdetails
    //함수 종료시 @AuthenticationPricipal 어노테이션이 만드어진다.
    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUserEmail(userEmail);
        User user = userOptional.orElseThrow(() ->
                new UsernameNotFoundException("User not found with email: " + userEmail)
        );

        return new PrincipalDetails(user);
    }
}