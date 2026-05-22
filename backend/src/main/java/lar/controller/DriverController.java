package lar.controller;

import lar.entity.Driver;
import lar.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping("/save")
    public Driver saveDriver(@RequestBody Driver driver) {
        return driverService.saveDriver(driver);
    }

    @GetMapping("/all")
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }
}