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

    @PutMapping("/update-status/{trackingId}")
    public Shipment updateShipmentStatus(
            @PathVariable String trackingId,
            @RequestParam String status) {

        return shipmentService.updateShipmentStatus(trackingId, status);
    }

    @PutMapping("/assign-driver/{trackingId}")
    public Shipment assignDriver(
            @PathVariable String trackingId,
            @RequestParam String driver) {

        return shipmentService.assignDriver(trackingId, driver);
    }

    @PutMapping("/assign-vehicle/{trackingId}")
    public Shipment assignVehicle(
            @PathVariable String trackingId,
            @RequestParam String vehicle) {

        return shipmentService.assignVehicle(trackingId, vehicle);
    }
}