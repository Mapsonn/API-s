package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.dto.FavoritoItemResponseDTO;
import com.uade.tpo.e_commerce1.exception.OperacionInvalidaException;
import com.uade.tpo.e_commerce1.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce1.model.FavoritoItem;
import com.uade.tpo.e_commerce1.model.Producto;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.FavoritoRepository;
import com.uade.tpo.e_commerce1.repository.ProductoRepository;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired 
    private ProductoRepository productoRepository;

    // 1. Agregar a favoritos
    public String agregarAFavoritos(Long usuarioId, Long productoId) {
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNotFoundException("Error: Usuario no encontrado"));

        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new RecursoNotFoundException("Error: Producto no encontrado"));

        // Verificar si ya existe en favoritos
        var itemExistente = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);
        if (itemExistente.isPresent()) {
            throw new OperacionInvalidaException("Este producto ya está en favoritos");
        }

        // Crear el item 
        FavoritoItem nuevoItem = new FavoritoItem();
        nuevoItem.setProducto(producto);
        nuevoItem.setUsuario(usuario);

        favoritoRepository.save(nuevoItem);
        return "Producto agregado a favoritos";
    }

    public List<FavoritoItemResponseDTO> obtenerFavoritos(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
            .stream()
            .map(this::mapToResponseDTO)
            .toList();
    }

    // 2. Eliminar de favoritos
    public String eliminarDeFavoritos(Long favoritoItemId) {
        if (favoritoRepository.existsById(favoritoItemId)) {
            favoritoRepository.deleteById(favoritoItemId);
            return "Producto eliminado de favoritos";
        }
        throw new RecursoNotFoundException("Error: El ítem no existe en favoritos");
    }

    // 3. Limpiar favoritos
    public String limpiarFavoritos(Long usuarioId) {
        List<FavoritoItem> items = favoritoRepository.findByUsuarioId(usuarioId);
        if (items.isEmpty()) {
            throw new OperacionInvalidaException("Los favoritos ya están vacíos");
        }
        favoritoRepository.deleteAll(items);
        return "Favoritos vaciados correctamente";
    }

    private FavoritoItemResponseDTO mapToResponseDTO(FavoritoItem item) {
        Producto producto = item.getProducto();
        FavoritoItemResponseDTO dto = new FavoritoItemResponseDTO();

        dto.setFavoritoItemId(item.getId());
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setImagenesUrl(producto.getImagenes());

        if (producto.getCategoria() != null) {
            dto.setCategoriaId(producto.getCategoria().getId());
            dto.setNombreCategoria(producto.getCategoria().getNombreCategoria());
        }

        if (producto.getUsuario() != null) {
            dto.setUsuarioId(producto.getUsuario().getId());
            dto.setNombreVendedor(producto.getUsuario().getNombre() + " " + producto.getUsuario().getApellido());
        }

        return dto;
    }
}
