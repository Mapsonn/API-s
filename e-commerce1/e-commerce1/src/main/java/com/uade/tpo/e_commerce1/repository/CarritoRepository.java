package com.uade.tpo.e_commerce1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce1.model.CarritoItem;
import java.util.List;

public interface CarritoRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuarioId(Long usuarioId);
}