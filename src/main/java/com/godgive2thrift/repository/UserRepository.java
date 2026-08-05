package com.godgive2thrift.repository;

import com.godgive2thrift.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);

}