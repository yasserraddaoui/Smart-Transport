package com.smarttransport.authservice.config;

import com.smarttransport.authservice.domain.AppUser;
import com.smarttransport.authservice.domain.UserRole;
import com.smarttransport.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            userRepository.save(new AppUser(
                    "admin.tn",
                    encoder.encode("Admin123!"),
                    UserRole.ADMIN,
                    "Admin Transport Tunisie",
                    "Tunis"
            ));

            userRepository.save(new AppUser(
                    "driver.tn",
                    encoder.encode("Driver123!"),
                    UserRole.DRIVER,
                    "Hedi Ben Salah",
                    "Sousse"
            ));

            userRepository.save(new AppUser(
                    "user.tn",
                    encoder.encode("User123!"),
                    UserRole.USER,
                    "Amira Trabelsi",
                    "Sfax"
            ));
        };
    }
}
