package com.uade.tpo.e_commerce1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce1.model.Producto;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    //Listado de productos ordenados alfabéticamente
    List<Producto> findAllByOrderByNombreAsc();
    List<Producto> findByCategoriaIdOrderByNombreAsc(Long categoriaId);
}