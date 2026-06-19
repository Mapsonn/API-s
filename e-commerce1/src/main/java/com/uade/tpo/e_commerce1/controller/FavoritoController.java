package com.uade.tpo.e_commerce1.controller;

import com.uade.tpo.e_commerce1.dto.FavoritoItemResponseDTO;
import com.uade.tpo.e_commerce1.service.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {
    
    @Autowired 
    private FavoritoService favoritoService;

    @GetMapping("/{usuarioId}")
    public List<FavoritoItemResponseDTO> obtenerFavoritos(@PathVariable Long usuarioId) {
        return favoritoService.obtenerFavoritos(usuarioId);
    }

    @PostMapping("/agregar")
    public String agregar(@RequestParam Long usuarioId, 
                          @RequestParam Long productoId) {
        return favoritoService.agregarAFavoritos(usuarioId, productoId);
    }

    @DeleteMapping("/eliminar/{itemId}")
    public String eliminar(@PathVariable Long itemId) {
        return favoritoService.eliminarDeFavoritos(itemId);
    }

    @DeleteMapping("/limpiar/{usuarioId}")
    public String limpiar(@PathVariable Long usuarioId) {
        return favoritoService.limpiarFavoritos(usuarioId);
    }
    
}
