package com.godgive2thrift.service;

import com.godgive2thrift.entity.Address;
import com.godgive2thrift.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService{

    private final AddressRepository repository;

    public AddressService(AddressRepository repository){

        this.repository=repository;

    }

    public List<Address> getAddresses(String email){

        return repository.findByEmail(email);

    }

    public Address save(Address address){

        return repository.save(address);

    }

    public void delete(Long id){

        repository.deleteById(id);

    }

}