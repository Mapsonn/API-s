package com.uade.tpo.e_commerce1.repository;

import com.uade.tpo.e_commerce1.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; 

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
}