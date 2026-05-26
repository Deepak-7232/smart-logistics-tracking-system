package lar.controller;

import lar.entity.Shipment;
import lar.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    
    @GetMapping("/my-shipments/{email}")
    public List<Shipment> myShipments(@PathVariable String email) {
        return shipmentService.getShipmentsByDriverEmail(email);
    }

    
    @PutMapping("/update-status/{trackingId}")
    public Shipment updateStatus(
            @PathVariable String trackingId,
            @RequestParam String status) {

        return shipmentService.updateShipmentStatus(trackingId, status);
    }
}