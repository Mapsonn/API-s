package com.uade.tpo.e_commerce1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Registro con validación
    public Usuario guardar(Usuario nuevoUsuario) {
        if (usuarioRepository.findByUsername(nuevoUsuario.getUsername()).isPresent()) {
            throw new RuntimeException("Error: El nombre de usuario '" + nuevoUsuario.getUsername() + "' ya está en uso");
        }
        return usuarioRepository.save(nuevoUsuario);
    }

    public String eliminar(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return "Usuario eliminado correctamente.";
        }
        return "Error: No se encontró el usuario.";
    }
}