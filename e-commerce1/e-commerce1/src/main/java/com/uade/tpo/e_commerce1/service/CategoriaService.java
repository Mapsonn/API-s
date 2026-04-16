package com.uade.tpo.e_commerce1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce1.model.Categoria;
import com.uade.tpo.e_commerce1.repository.CategoriaRepository;
import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // 1. Obtener todas las categorías
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    // 2. Buscar por ID
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
    }

    // 3. Crear una nueva
    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // 4. Eliminar
    public String eliminar(Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return "Categoría eliminada";
        }
        return "No se pudo eliminar: ID no encontrado";
    }
}