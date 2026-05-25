package lar.service;

import lar.entity.Driver;
import lar.entity.Shipment;
import lar.repository.DriverRepository;
import lar.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DriverRepository driverRepository;

    private static final Set<String> VALID_STATUSES = Set.of(
            "PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"
    );

    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentByTrackingId(String trackingId) {
        return shipmentRepository.findByTrackingId(trackingId);
    }

    public Shipment updateShipmentStatus(String trackingId, String status) {
        if (status == null || !VALID_STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }
        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);
        if (shipment == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found: " + trackingId);
        shipment.setStatus(status);

        // Free the driver when the shipment is completed
        if ("DELIVERED".equals(status) || "CANCELLED".equals(status)) {
            if (shipment.getDriver() != null) {
                Driver driver = shipment.getDriver();
                driver.setAvailable(true);
                driver.setVehicleAssigned(null);
                driverRepository.save(driver);
            }
        }

        return shipmentRepository.save(shipment);
    }

    /**
     * Assign (or unassign) a driver to a shipment.
     *
     * Key rules:
     *  - driverId == null → unassign: free the current driver and set driver to null.
     *  - Re-assigning the SAME driver that is already on this shipment is a no-op (allowed).
     *  - Assigning a NEW driver requires that driver to be available.
     */
    public Shipment assignDriver(String trackingId, Long driverId) {
        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);
        if (shipment == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found: " + trackingId);

        Long currentDriverId = shipment.getDriver() != null ? shipment.getDriver().getId() : null;

        // ── UNASSIGN ────────────────────────────────────────────────────────────
        if (driverId == null) {
            if (shipment.getDriver() != null) {
                Driver oldDriver = shipment.getDriver();
                oldDriver.setAvailable(true);
                oldDriver.setVehicleAssigned(null);
                driverRepository.save(oldDriver);
            }
            shipment.setDriver(null);
            return shipmentRepository.save(shipment);
        }

        // ── SAME DRIVER (no-op re-save) ──────────────────────────────────────
        if (driverId.equals(currentDriverId)) {
            // Nothing changed — just return the current state
            return shipment;
        }

        // ── ASSIGN NEW DRIVER ────────────────────────────────────────────────
        Driver newDriver = driverRepository.findById(driverId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found: " + driverId)
        );

        if (!Boolean.TRUE.equals(newDriver.getAvailable())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Driver '" + newDriver.getName() + "' is currently unavailable — they may be assigned to another shipment."
            );
        }

        // Free the previous driver first
        if (shipment.getDriver() != null) {
            Driver oldDriver = shipment.getDriver();
            oldDriver.setAvailable(true);
            oldDriver.setVehicleAssigned(null);
            driverRepository.save(oldDriver);
        }

        shipment.setDriver(newDriver);
        newDriver.setAvailable(false);
        if (shipment.getVehicleAssigned() != null && !shipment.getVehicleAssigned().isEmpty()) {
            newDriver.setVehicleAssigned(shipment.getVehicleAssigned());
        }
        driverRepository.save(newDriver);

        return shipmentRepository.save(shipment);
    }

    public Shipment assignVehicle(String trackingId, String vehicleNumber) {
        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);
        if (shipment == null) throw new RuntimeException("Shipment not found: " + trackingId);
        
        String newVehicle = (vehicleNumber != null && vehicleNumber.trim().isEmpty()) ? null : vehicleNumber;
        shipment.setVehicleAssigned(newVehicle);
        
        // If there is a driver assigned to this shipment, update their vehicle too
        if (shipment.getDriver() != null) {
            Driver driver = shipment.getDriver();
            driver.setVehicleAssigned(newVehicle);
            driverRepository.save(driver);
        }
        
        return shipmentRepository.save(shipment);
    }

    /** Returns all shipments assigned to a given driver (by email). */
    public List<Shipment> getShipmentsByDriverEmail(String email) {
        Driver driver = driverRepository.findByEmail(email);
        if (driver == null) throw new RuntimeException("Driver not found: " + email);
        return shipmentRepository.findByDriver(driver);
    }
}