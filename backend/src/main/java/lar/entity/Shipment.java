package lar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Replaces the old String driverAssigned field.
     * Now a proper FK relationship: shipments.driver_id → drivers.id
     */
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private String vehicleAssigned;

    private String trackingId;

    private String senderName;

    private String receiverName;

    private String source;

    private String destination;

    private String status;

    public Shipment() {}

    public Long getId() { return id; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public String getVehicleAssigned() { return vehicleAssigned; }
    public void setVehicleAssigned(String vehicleAssigned) { this.vehicleAssigned = vehicleAssigned; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}