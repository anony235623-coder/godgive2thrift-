package com.godgive2thrift.controller;

import com.godgive2thrift.entity.Promo;
import com.godgive2thrift.service.PromoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promos")
@CrossOrigin(origins = "http://localhost:8080")
public class PromoController{

    private final PromoService service;

    public PromoController(PromoService service){

        this.service=service;

    }

    @GetMapping
    public List<Promo> getAll(){

        return service.getAll();

    }

    @PostMapping
    public Promo save(@RequestBody Promo promo){

        return service.save(promo);

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){

        service.delete(id);

    }

    @GetMapping("/{code}")
    public Promo validate(@PathVariable String code){

        return service.validate(code);

    }

}