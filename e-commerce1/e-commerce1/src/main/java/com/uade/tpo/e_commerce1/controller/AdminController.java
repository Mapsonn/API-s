package com.uade.tpo.e_commerce1.controller;

import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> getStats() {
        return ResponseEntity.ok("Bienvenido al panel de administración. Solo vos podés ver esto.");
    }
}