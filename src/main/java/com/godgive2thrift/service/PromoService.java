package com.godgive2thrift.service;

import com.godgive2thrift.entity.Promo;
import com.godgive2thrift.repository.PromoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromoService{

    private final PromoRepository repository;

    public PromoService(PromoRepository repository){

        this.repository=repository;

    }

    public List<Promo> getAll(){

        return repository.findAll();

    }

    public Promo save(Promo promo){

        return repository.save(promo);

    }

    public void delete(Long id){

        repository.deleteById(id);

    }

    public Promo validate(String code){

        return repository.findByCode(code);

    }

}
