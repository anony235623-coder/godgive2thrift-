package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Promo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromoRepository
extends JpaRepository<Promo,Long>{

    Promo findByCode(String code);

}