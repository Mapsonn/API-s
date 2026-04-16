package com.uade.tpo.e_commerce1.controller;

import com.uade.tpo.e_commerce1.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "http://localhost:5173")
public class CarritoController {
    
    @Autowired 
    private CarritoService carritoService;

    //1. Agregar un producto al carrito
    //URL http://localhost:8080/api/carrito/agregar?usuarioId=1&productoId=2&cantidad=3 (Metodo  POST en Postman)
    @PostMapping("/agregar")
    public String agregar(@RequestParam Long usuarioId, 
                          @RequestParam Long productoId, 
                          @RequestParam Integer cantidad) {
        return carritoService.agregarAlCarrito(usuarioId, productoId, cantidad);
    }

    //2. Eliminar un item 
    //URL http://localhost:8080/api/carrito/eliminar/5 (Metodo DELETE en Postman)
    @DeleteMapping("/eliminar/{itemId}")
    public String eliminar(@PathVariable Long itemId) {
        return carritoService.eliminarDelCarrito(itemId);
    }

    // 3. Ver el total de la cuenta para un usuario
    // URL http://localhost:8080/api/carrito/total/1 (Metodo GET en Postman)
    @GetMapping("/total/{usuarioId}")
    public Double getTotal(@PathVariable Long usuarioId) {
        return carritoService.calcularTotal(usuarioId);
    }

    //4. Vaciar carrito completo
    //URL http://localhost:8080/api/carrito/vaciar/1 (Metodo DELETE en Postman)
    @DeleteMapping("/vaciar/{usuarioId}")
    public String vaciar(@PathVariable Long usuarioId) {
        return carritoService.vaciarCarrito(usuarioId);
    }

    //5. Checkout
    // URL http://localhost:8080/api/carrito/checkout/1 (Metodo POST en Postman)
    @PostMapping("/checkout/{usuarioId}")
    public String realizarCompra(@PathVariable Long usuarioId) {
        return carritoService.realizarCheckout(usuarioId);
    }

}