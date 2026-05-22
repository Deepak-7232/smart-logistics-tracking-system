package lar.repository;

import lar.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Shipment findByTrackingId(String trackingId);
}