package lar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;

    private String vehicleType;

    private String capacity;

    private String driverAssigned;

    private String currentLocation;

    private String status;

    public Vehicle() {
    }

    public Vehicle(Long id, String vehicleNumber, String vehicleType,
                   String capacity, String driverAssigned,
                   String currentLocation, String status) {

        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.driverAssigned = driverAssigned;
        this.currentLocation = currentLocation;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }

    public String getDriverAssigned() {
        return driverAssigned;
    }

    public void setDriverAssigned(String driverAssigned) {
        this.driverAssigned = driverAssigned;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}