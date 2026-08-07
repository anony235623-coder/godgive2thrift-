package com.godgive2thrift.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // Enable CORS
                .cors(Customizer.withDefaults())

                // Disable CSRF
                .csrf(csrf -> csrf.disable())

                // Authorization
                .authorizeHttpRequests(auth -> auth

                        // Public Pages
                        .requestMatchers(
                                "/",
                                "/login",
                                "/register",
                                "/shop",
                                "/cart",
                                "/checkout",
                                "/product",
                                "/account",
                                "/admin",
                                "/orders",
                                "/reports",

                                // Static Resources
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/uploads/**",

                                // APIs
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/orders/**",
                                "/api/dashboard/**"
                        ).permitAll()

                        // Everything else
                        .anyRequest().permitAll()
                )

                // Disable default login
                .formLogin(form -> form.disable())

                // Disable HTTP Basic
                .httpBasic(basic -> basic.disable())

                // Disable Logout
                .logout(logout -> logout.disable());

        return http.build();
    }
}