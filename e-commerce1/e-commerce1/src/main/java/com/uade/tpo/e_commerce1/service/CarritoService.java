package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.exception.OperacionInvalidaException;
import com.uade.tpo.e_commerce1.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce1.model.CarritoItem;
import com.uade.tpo.e_commerce1.model.Producto;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.CarritoRepository;
import com.uade.tpo.e_commerce1.repository.ProductoRepository;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired 
    private ProductoRepository productoRepository; // Necesitamos el repo para obtener la entidad pura

    @Autowired 
    private ProductoService productoService;

    // 1. Agregar al carrito
    public String agregarAlCarrito(Long usuarioId, Long productoId, Integer cantidad) {
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RecursoNotFoundException("Error: Usuario no encontrado"));

        // IMPORTANTE: Buscamos la ENTIDAD directamente del Repo
        // porque el Service ahora devuelve DTOs y el CarritoItem necesita la Entidad.
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new RecursoNotFoundException("Error: Producto no encontrado"));

        // Validar stock
        if (producto.getStock() < cantidad) {
            throw new OperacionInvalidaException("Error: No hay stock disponible. Stock actual: " + producto.getStock());
        }

        // Crear el item 
        CarritoItem nuevoItem = new CarritoItem();
        nuevoItem.setProducto(producto);
        nuevoItem.setCantidad(cantidad);
        nuevoItem.setUsuario(usuario);

        carritoRepository.save(nuevoItem);
        return "Producto agregado al carrito";
    }

    // 2. Eliminar
    public String eliminarDelCarrito(Long carritoItemId) {
        if (carritoRepository.existsById(carritoItemId)) {
            carritoRepository.deleteById(carritoItemId);
            return "Producto eliminado del carrito";
        }
        throw new RecursoNotFoundException("Error: El ítem no existe en el carrito");
    }

    // 3. Costo Total
    public Double calcularTotal(Long usuarioId) { 
        List<CarritoItem> items = carritoRepository.findByUsuarioId(usuarioId);
        return items.stream()
                    .mapToDouble(item -> item.getProducto().getPrecio() * item.getCantidad())
                    .sum();
    }

    // 4. Checkout
    @Transactional
    public String realizarCheckout(Long usuarioId) {
        List<CarritoItem> items = carritoRepository.findByUsuarioId(usuarioId);
        
        if (items.isEmpty()) {
            throw new OperacionInvalidaException("El carrito está vacío");
        }

        // Procesar cada ítem usando la lógica de stock del ProductoService
        for (CarritoItem item : items) {
            boolean exitoStock = productoService.validarYDescontarStock(
                item.getProducto().getId(), 
                item.getCantidad()
            );
            
            if (!exitoStock) {
                // Si falla el stock, la transacción hace rollback automáticamente por el @Transactional
                throw new OperacionInvalidaException("Error crítico: Se agotó el stock de " + item.getProducto().getNombre());
            }
        }

        Double totalPagado = calcularTotal(usuarioId);

        // Vaciar el carrito
        carritoRepository.deleteAll(items);

        return "Compra finalizada con éxito. Total cobrado: $" + totalPagado;
    }
}