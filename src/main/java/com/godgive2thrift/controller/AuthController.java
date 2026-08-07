package com.godgive2thrift.controller;

import com.godgive2thrift.entity.User;
import com.godgive2thrift.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "https://www.godgive2thrift.com",
        "https://godgive2thrift.com"
    },
    allowCredentials = "true"
)
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ===========================
    // REGISTER
    // ===========================

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // ===========================
    // LOGIN
    // ===========================

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> request,
            HttpSession session) {

        String email = request.get("email");
        String password = request.get("password");

        User user = userService.login(email, password);

        Map<String, Object> response = new HashMap<>();

        if (user == null) {

            response.put("status", "failed");
            response.put("message", "Invalid email or password.");

        } else {

            // Save user in session
            session.setAttribute("user", user);

            response.put("status", "success");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

        }

        return response;
    }

    // ===========================
    // CURRENT USER
    // ===========================

    @GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        User user = (User) session.getAttribute("user");

        if (user == null) {

            response.put("authenticated", false);

            return response;

        }

        response.put("authenticated", true);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }

    // ===========================
    // LOGOUT
    // ===========================

    @PostMapping("/logout")
    public Map<String, String> logout(HttpSession session) {

        session.invalidate();

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logged out successfully.");

        return response;
    }
    // ===========================
// UPDATE PROFILE
// ===========================

@PutMapping("/update")
public Map<String, Object> updateProfile(
        @RequestBody User updatedUser,
        HttpSession session) {

    Map<String, Object> response = new HashMap<>();

    User currentUser = (User) session.getAttribute("user");

    if (currentUser == null) {

        response.put("status", "failed");
        response.put("message", "Please login first.");

        return response;

    }

    currentUser.setName(updatedUser.getName());
    currentUser.setEmail(updatedUser.getEmail());

    User savedUser = userService.updateProfile(currentUser);

    session.setAttribute("user", savedUser);

    response.put("status", "success");
    response.put("message", "Profile updated successfully.");

    return response;

}
@PutMapping("/change-password")
public Map<String,Object> changePassword(
        @RequestBody Map<String,String> request,
        HttpSession session){

    Map<String,Object> response = new HashMap<>();

    User user = (User) session.getAttribute("user");

    if(user == null){

        response.put("status","failed");
        response.put("message","Please login first.");

        return response;

    }

    String currentPassword = request.get("currentPassword");
    String newPassword = request.get("newPassword");

    boolean changed =
            userService.changePassword(
                    user,
                    currentPassword,
                    newPassword
            );

    if(changed){

        session.setAttribute("user", user);

        response.put("status","success");
        response.put("message","Password changed successfully.");

    }else{

        response.put("status","failed");
        response.put("message","Current password is incorrect.");

    }

    return response;

}

}