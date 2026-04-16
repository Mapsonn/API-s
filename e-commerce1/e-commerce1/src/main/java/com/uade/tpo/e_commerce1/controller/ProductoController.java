package com.uade.tpo.e_commerce1.controller;

import com.uade.tpo.e_commerce1.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce1.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce1.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> getAllProductos() {
        return ResponseEntity.ok(productoService.obtenerTodosOrdenadosDTO());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoResponseDTO>> buscarProductoNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(productoService.buscarPorNombreDTO(nombre));
    }

    @GetMapping("/destacado")
    public ResponseEntity<String> getDestacado() {
        return ResponseEntity.ok(productoService.obtenerDestacado());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.buscarPorIdDTO(id));
    }

    // usuarioId requerido para validar que el dueño es quien elimina
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductoById(@PathVariable Long id, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(productoService.eliminar(id, usuarioId));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> updateProducto(
            @PathVariable Long id,
            @ModelAttribute ProductoRequestDTO requestDTO,
            @RequestParam(value = "imagenes", required = false) List<MultipartFile> imagenes) {

        ProductoResponseDTO actualizado = productoService.actualizarConDTO(id, requestDTO, imagenes);
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoResponseDTO>> getProductosByCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.obtenerPorCategoriaDTO(categoriaId));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> crearProducto(
            @ModelAttribute ProductoRequestDTO requestDTO,
            @RequestParam("imagenes") List<MultipartFile> imagenes) {

        ProductoResponseDTO guardado = productoService.guardarConDTO(requestDTO, imagenes);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> finalizarCompra(@RequestBody List<ProductoService.CheckoutItem> items) {
        productoService.procesarCheckout(items);
        return ResponseEntity.ok("Compra realizada con éxito");
    }
}
