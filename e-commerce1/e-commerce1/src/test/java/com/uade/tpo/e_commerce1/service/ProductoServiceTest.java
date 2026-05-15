package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce1.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce1.model.Categoria;
import com.uade.tpo.e_commerce1.model.Producto;
import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.CategoriaRepository;
import com.uade.tpo.e_commerce1.repository.ProductoRepository;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void obtenerTodosOrdenadosDTO_MapsEntityFieldsToDto() {
        Producto producto = crearProducto(1L, "Auriculares", 10, 19999.0);
        when(productoRepository.findAllByOrderByNombreAsc()).thenReturn(List.of(producto));

        List<ProductoResponseDTO> resultado = productoService.obtenerTodosOrdenadosDTO();

        assertEquals(1, resultado.size());
        ProductoResponseDTO dto = resultado.get(0);
        assertEquals(1L, dto.getId());
        assertEquals("Auriculares", dto.getNombre());
        assertEquals("Audio", dto.getNombreCategoria());
        assertEquals(5L, dto.getUsuarioId());
        assertEquals("Ana Lopez", dto.getNombreVendedor());
        assertEquals(List.of("img1.png"), dto.getImagenesUrl());
    }

    @Test
    void validarYDescontarStock_WhenStockIsEnough_UpdatesAndReturnsTrue() {
        Producto producto = crearProducto(10L, "Mouse", 7, 1000.0);
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        boolean resultado = productoService.validarYDescontarStock(10L, 3);

        assertTrue(resultado);
        assertEquals(4, producto.getStock());
        verify(productoRepository).save(producto);
    }

    @Test
    void validarYDescontarStock_WhenStockIsInsufficient_ReturnsFalseWithoutSaving() {
        Producto producto = crearProducto(11L, "Teclado", 2, 2000.0);
        when(productoRepository.findById(11L)).thenReturn(Optional.of(producto));

        boolean resultado = productoService.validarYDescontarStock(11L, 3);

        assertFalse(resultado);
        assertEquals(2, producto.getStock());
        verify(productoRepository, never()).save(producto);
    }

    @Test
    void validarYDescontarStock_WhenProductNotFound_ThrowsNotFoundException() {
        when(productoRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(RecursoNotFoundException.class,
                () -> productoService.validarYDescontarStock(100L, 1));
    }

    private Producto crearProducto(Long id, String nombre, Integer stock, Double precio) {
        Categoria categoria = new Categoria();
        categoria.setId(2L);
        categoria.setNombreCategoria("Audio");

        Usuario usuario = Usuario.builder()
                .id(5L)
                .nombre("Ana")
                .apellido("Lopez")
                .email("ana@mail.com")
                .password("secret")
                .role(Role.USER)
                .build();

        Producto producto = new Producto();
        producto.setId(id);
        producto.setNombre(nombre);
        producto.setDescripcion("Desc");
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setCategoria(categoria);
        producto.setUsuario(usuario);
        producto.setImagenes(List.of("img1.png"));
        return producto;
    }
}
