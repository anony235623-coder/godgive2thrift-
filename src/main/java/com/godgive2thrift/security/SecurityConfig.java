package com.godgive2thrift.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // ==========================
                // PUBLIC PAGES
                // ==========================
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
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/api/auth/**"
                ).permitAll()

                // ==========================
                // PRODUCT API
                // ==========================
                .requestMatchers("/api/products/**").permitAll()

                // ==========================
                // ORDER API
                // ==========================
                .requestMatchers("/api/orders/**").permitAll()

                // ==========================
                // DASHBOARD API
                // ==========================
                .requestMatchers("/api/dashboard/**").permitAll()

                // Everything else
                .anyRequest().permitAll()

            )

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .logout(logout -> logout.disable());

        return http.build();
    }

}