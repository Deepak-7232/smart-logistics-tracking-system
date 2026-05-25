package lar.repository;

import lar.entity.Driver;
import lar.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Shipment findByTrackingId(String trackingId);

    List<Shipment> findByDriver(Driver driver);
}