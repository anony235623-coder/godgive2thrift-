package com.godgive2thrift.controller;

import com.godgive2thrift.entity.Address;
import com.godgive2thrift.service.AddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(
    origins = "http://localhost:8080",
    allowCredentials = "true"
)
public class AddressController{

    private final AddressService service;

    public AddressController(AddressService service){

        this.service=service;

    }

    @GetMapping("/{email}")
    public List<Address> getAddresses(
            @PathVariable String email){

        return service.getAddresses(email);

    }

    @PostMapping
    public Address save(
            @RequestBody Address address){

        return service.save(address);

    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id){

        service.delete(id);

    }

}