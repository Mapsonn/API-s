package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.exception.OperacionInvalidaException;
import com.uade.tpo.e_commerce1.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce1.model.CarritoItem;
import com.uade.tpo.e_commerce1.model.Producto;
import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.CarritoRepository;
import com.uade.tpo.e_commerce1.repository.ProductoRepository;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarritoServiceTest {

    @Mock
    private CarritoRepository carritoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private CarritoService carritoService;

    @Test
    void agregarAlCarrito_WhenDataIsValid_SavesItem() {
        Usuario usuario = crearUsuario(1L);
        Producto producto = crearProducto(10L, "Monitor", 5, 50000.0);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        String mensaje = carritoService.agregarAlCarrito(1L, 10L, 2);

        assertEquals("Producto agregado al carrito", mensaje);

        ArgumentCaptor<CarritoItem> itemCaptor = ArgumentCaptor.forClass(CarritoItem.class);
        verify(carritoRepository).save(itemCaptor.capture());

        CarritoItem guardado = itemCaptor.getValue();
        assertEquals(usuario, guardado.getUsuario());
        assertEquals(producto, guardado.getProducto());
        assertEquals(2, guardado.getCantidad());
    }

    @Test
    void agregarAlCarrito_WhenStockIsNotEnough_ThrowsOperacionInvalidaException() {
        Usuario usuario = crearUsuario(1L);
        Producto producto = crearProducto(10L, "Monitor", 1, 50000.0);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        assertThrows(OperacionInvalidaException.class,
                () -> carritoService.agregarAlCarrito(1L, 10L, 2));

        verify(carritoRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void vaciarCarrito_WhenCartHasNoItems_ThrowsOperacionInvalidaException() {
        when(carritoRepository.findByUsuarioId(1L)).thenReturn(List.of());

        assertThrows(OperacionInvalidaException.class, () -> carritoService.vaciarCarrito(1L));

        verify(carritoRepository, never()).deleteAll(org.mockito.ArgumentMatchers.anyList());
    }

    @Test
    void realizarCheckout_WhenStockIsValid_DeletesItemsAndReturnsTotal() {
        Producto p1 = crearProducto(1L, "Mouse", 10, 10000.0);
        Producto p2 = crearProducto(2L, "Teclado", 10, 15000.0);

        CarritoItem i1 = new CarritoItem();
        i1.setId(11L);
        i1.setProducto(p1);
        i1.setCantidad(2);

        CarritoItem i2 = new CarritoItem();
        i2.setId(12L);
        i2.setProducto(p2);
        i2.setCantidad(1);

        List<CarritoItem> items = List.of(i1, i2);
        when(carritoRepository.findByUsuarioId(1L)).thenReturn(items);
        when(productoService.validarYDescontarStock(1L, 2)).thenReturn(true);
        when(productoService.validarYDescontarStock(2L, 1)).thenReturn(true);

        String resultado = carritoService.realizarCheckout(1L);

        assertTrue(resultado.contains("Compra finalizada con éxito"));
        assertTrue(resultado.contains("$35000.0"));
        verify(carritoRepository).deleteAll(items);
    }

    @Test
    void eliminarDelCarrito_WhenItemDoesNotExist_ThrowsNotFound() {
        when(carritoRepository.existsById(100L)).thenReturn(false);

        assertThrows(RecursoNotFoundException.class,
                () -> carritoService.eliminarDelCarrito(100L));

        verify(carritoRepository, never()).deleteById(100L);
    }

    private Usuario crearUsuario(Long id) {
        return Usuario.builder()
                .id(id)
                .nombre("Usuario")
                .apellido("Prueba")
                .email("usuario@mail.com")
                .password("secret")
                .role(Role.USER)
                .build();
    }

    private Producto crearProducto(Long id, String nombre, Integer stock, Double precio) {
        Producto producto = new Producto();
        producto.setId(id);
        producto.setNombre(nombre);
        producto.setStock(stock);
        producto.setPrecio(precio);
        return producto;
    }
}
