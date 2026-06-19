package com.uade.tpo.e_commerce1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map; // Para el login

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173") // <-- NECESARIO para que React conecte
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Usuario getUsuarioById(@PathVariable Long id) { 
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    public Usuario createUsuario(@Valid @RequestBody Usuario nuevoUsuario) {
        return usuarioService.guardar(nuevoUsuario);
    }

    @DeleteMapping("/{id}")
    public String deleteUsuario(@PathVariable Long id) {
        return usuarioService.eliminar(id);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");
        return usuarioService.login(username, password);
    }
}