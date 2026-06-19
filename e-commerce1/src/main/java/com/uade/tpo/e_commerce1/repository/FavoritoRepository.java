package com.uade.tpo.e_commerce1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce1.model.FavoritoItem;
import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<FavoritoItem, Long> {
    List<FavoritoItem> findByUsuarioId(Long usuarioId);
    Optional<FavoritoItem> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}
