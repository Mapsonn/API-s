package com.uade.tpo.e_commerce1.controller;

import com.uade.tpo.e_commerce1.model.Categoria;
import com.uade.tpo.e_commerce1.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias") // Plural para que coincida con tu axios.get
@CrossOrigin(origins = "http://localhost:5173") // Clave para que React lo vea
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // 1. Obtener todas las categorías para el Select de React
    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaService.obtenerTodas();
    }

    // 2. Obtener una categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }

    // 3. Crear una nueva categoría (opcional postman)
    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaService.guardar(categoria);
    }

    // 4. Eliminar categoría
    @DeleteMapping("/{id}")
    public String eliminarCategoria(@PathVariable Long id) {
        return categoriaService.eliminar(id);
    }
}