package lar.controller;

import lar.entity.Driver;
import lar.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Driver Controller
 *
 * ADMIN:  GET  /drivers/all           → list all drivers
 *         PUT  /drivers/availability/{id}?available=
 *         DELETE /drivers/{id}
 *
 * DRIVER: GET  /drivers/me/{email}    → own profile (availability toggle data)
 *         PUT  /drivers/availability/{id}?available= (own record only — SecurityConfig allows DRIVER)
 */
@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    /* ── ADMIN only ──────────────────────────────────────────────────────────── */

    @GetMapping("/all")
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Autowired
    private lar.repository.ShipmentRepository shipmentRepository;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        Driver driver = driverRepository.findById(id).orElse(null);
        if (driver != null) {
            // Unassign driver from any shipments to prevent FK constraint violation
            List<lar.entity.Shipment> shipments = shipmentRepository.findByDriver(driver);
            for (lar.entity.Shipment shipment : shipments) {
                shipment.setDriver(null);
                shipmentRepository.save(shipment);
            }
            driverRepository.delete(driver);
        }
        return ResponseEntity.noContent().build();
    }

    /* ── ADMIN + DRIVER ──────────────────────────────────────────────────────── */

    /**
     * Returns a driver's own profile by email.
     * Used by the driver portal (My Vehicle, Availability toggle).
     * SecurityConfig must allow DRIVER role on /drivers/me/**
     */
    @GetMapping("/me/{email}")
    public ResponseEntity<Driver> getMyProfile(@PathVariable String email) {
        Driver driver = driverRepository.findByEmail(email);
        if (driver == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(driver);
    }

    /**
     * Toggle availability. Called by ADMIN when assigning work,
     * and by DRIVER themselves to mark available/unavailable.
     */
    @PutMapping("/availability/{id}")
    public ResponseEntity<Driver> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available) {

        Driver driver = driverRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Driver not found: " + id)
        );
        driver.setAvailable(available);
        return ResponseEntity.ok(driverRepository.save(driver));
    }
}