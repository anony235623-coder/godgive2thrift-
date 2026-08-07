package com.godgive2thrift.controller;

import com.godgive2thrift.entity.User;
import com.godgive2thrift.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "https://www.godgive2thrift.com",
        "https://godgive2thrift.com"
    },
    allowCredentials = "true"
)
public class UserApiController {

    private final UserService userService;

    public UserApiController(UserService userService) {
        this.userService = userService;
    }

    // ==========================
    // ALL USERS
    // ==========================

    @GetMapping
    public List<User> getUsers() {

        return userService.getAllUsers();

    }

    // ==========================
    // SEARCH USERS
    // ==========================

    @GetMapping("/search")
    public List<User> searchUsers(
            @RequestParam String keyword) {

        return userService.searchUsers(keyword);

    }

}