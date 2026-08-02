package com.godgive2thrift.security;

import com.godgive2thrift.entity.User;
import com.godgive2thrift.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email);

        if (user == null) {

            throw new UsernameNotFoundException("User not found.");

        }

        return new CustomUserDetails(user);

    }

}
