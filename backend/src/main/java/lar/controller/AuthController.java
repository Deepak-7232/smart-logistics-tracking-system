package lar.controller;

import lar.dto.AuthResponse;
import lar.dto.LoginRequest;
import lar.entity.Admin;
import lar.entity.Driver;
import lar.repository.AdminRepository;
import lar.repository.DriverRepository;
import lar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller — Handles login for Admins and Drivers separately.
 *
 * POST /auth/register → creates a new DRIVER account
 * POST /auth/login → returns { token, role, email } on success
 * returns 401 on bad credentials
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtService jwtService;

    /**
     * Register a new driver account.
     * Role is always forced to "DRIVER" on self-registration.
     */
    @PostMapping("/register")
    public ResponseEntity<Driver> register(@RequestBody Driver driver) {
        driver.setRole("DRIVER");
        driver.setAvailable(true);
        Driver saved = driverRepository.save(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Login endpoint.
     * Looks up the user by email in the admins table first, then drivers table.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // 1. Check if the user is an Admin
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail());
        if (admin != null && admin.getPassword().equals(loginRequest.getPassword())) {
            String token = jwtService.generateToken(admin.getEmail(), admin.getRole());
            return ResponseEntity.ok(new AuthResponse(token, admin.getRole(), admin.getEmail()));
        }

        // 2. Check if the user is a Driver
        Driver driver = driverRepository.findByEmail(loginRequest.getEmail());
        if (driver != null && driver.getPassword().equals(loginRequest.getPassword())) {
            String token = jwtService.generateToken(driver.getEmail(), driver.getRole());
            return ResponseEntity.ok(new AuthResponse(token, driver.getRole(), driver.getEmail()));
        }

        // Return 401 — the frontend Axios interceptor handles this
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
