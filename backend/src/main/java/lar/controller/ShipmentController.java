package lar.controller;

import lar.entity.Shipment;
import lar.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Shipment Controller
 *
 * ADMIN endpoints:
 *   POST   /shipments/save
 *   GET    /shipments/all
 *   GET    /shipments/{trackingId}
 *   PUT    /shipments/assign-driver/{trackingId}?driverId=
 *   PUT    /shipments/assign-vehicle/{trackingId}?vehicle=
 *
 * ADMIN + DRIVER endpoints:
 *   GET    /shipments/my-shipments/{email}
 *   PUT    /shipments/update-status/{trackingId}?status=
 */
@RestController
@RequestMapping("/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    // ── ADMIN only ────────────────────────────────────────────────────────────

    @PostMapping("/save")
    public Shipment saveShipment(@RequestBody Shipment shipment) {
        return shipmentService.saveShipment(shipment);
    }

    @GetMapping("/all")
    public List<Shipment> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    @GetMapping("/{trackingId}")
    public Shipment getShipmentByTrackingId(@PathVariable String trackingId) {
        return shipmentService.getShipmentByTrackingId(trackingId);
    }

    /**
     * Assign a driver by their database ID.
     * Also validates driver availability before assignment.
     */
    @PutMapping("/assign-driver/{trackingId}")
    public Shipment assignDriver(
            @PathVariable String trackingId,
            @RequestParam(required = false) Long driverId) {

        return shipmentService.assignDriver(trackingId, driverId);
    }

    @PutMapping("/assign-vehicle/{trackingId}")
    public Shipment assignVehicle(
            @PathVariable String trackingId,
            @RequestParam String vehicle) {

        return shipmentService.assignVehicle(trackingId, vehicle);
    }

    // ── ADMIN + DRIVER ────────────────────────────────────────────────────────

    /**
     * Returns all shipments assigned to the driver with the given email.
     * Used by the driver portal to show "my work".
     */
    @GetMapping("/my-shipments/{email}")
    public List<Shipment> myShipments(@PathVariable String email) {
        return shipmentService.getShipmentsByDriverEmail(email);
    }

    /**
     * Driver (or admin) updates the status of a shipment.
     */
    @PutMapping("/update-status/{trackingId}")
    public Shipment updateStatus(
            @PathVariable String trackingId,
            @RequestParam String status) {

        return shipmentService.updateShipmentStatus(trackingId, status);
    }
}