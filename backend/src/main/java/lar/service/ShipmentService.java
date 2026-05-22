package lar.service;

import lar.entity.Shipment;
import lar.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

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

        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);

        if (shipment != null) {
            shipment.setStatus(status);
            return shipmentRepository.save(shipment);
        }

        return null;
    }

    public Shipment assignDriver(String trackingId, String driverName) {

        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);

        if (shipment != null) {
            shipment.setDriverAssigned(driverName);
            return shipmentRepository.save(shipment);
        }

        return null;
    }

    public Shipment assignVehicle(String trackingId, String vehicleNumber) {

        Shipment shipment = shipmentRepository.findByTrackingId(trackingId);

        if (shipment != null) {
            shipment.setVehicleAssigned(vehicleNumber);
            return shipmentRepository.save(shipment);
        }

        return null;
    }
}