package lar.controller;

import lar.entity.User;
import lar.repository.UserRepository;
import lar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {

        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(loginUser.getEmail())
                        && u.getPassword().equals(loginUser.getPassword()))
                .findFirst()
                .orElse(null);

        if (user != null) {
            return jwtService.generateToken(user.getEmail());
        }

        return "Invalid Credentials";
    }
}