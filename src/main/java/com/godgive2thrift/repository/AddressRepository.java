package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository
extends JpaRepository<Address,Long>{

    List<Address> findByEmail(String email);

}