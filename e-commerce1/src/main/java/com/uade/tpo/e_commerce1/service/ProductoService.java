package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.dto.ProductoRequestDTO;
import com.uade.tpo.e_commerce1.dto.ProductoResponseDTO;
import com.uade.tpo.e_commerce1.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce1.model.Categoria;
import com.uade.tpo.e_commerce1.model.Producto;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.CategoriaRepository;
import com.uade.tpo.e_commerce1.repository.ProductoRepository;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired 
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final String DIRECTORIO_IMAGENES = "imagenes";

    // --- MÉTODOS DE CONSULTA (Retornan DTO) ---

    public List<ProductoResponseDTO> obtenerTodosOrdenadosDTO() {
        return productoRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoResponseDTO> buscarPorNombreDTO(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ProductoResponseDTO buscarPorIdDTO(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return mapToResponseDTO(producto);
    }

    public List<ProductoResponseDTO> obtenerPorCategoriaDTO(Long categoriaId) {
        return productoRepository.findByCategoriaIdOrderByNombreAsc(categoriaId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // --- MÉTODOS DE PERSISTENCIA (Usan RequestDTO) ---

    @Transactional
    public ProductoResponseDTO guardarConDTO(ProductoRequestDTO request, List<MultipartFile> imagenes) {
        Categoria cat = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Usuario user = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = new Producto();
        updateEntityFromDTO(producto, request, cat, user);

        if (imagenes != null) {
            for (MultipartFile imagen : imagenes) {
                if (imagen != null && !imagen.isEmpty()) {
                    try {
                        producto.getImagenes().add(procesarImagen(imagen));
                    } catch (IOException e) {
                        throw new RuntimeException("Error al procesar la imagen");
                    }
                }
            }
        }

        return mapToResponseDTO(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponseDTO actualizarConDTO(Long id, ProductoRequestDTO request, List<MultipartFile> imagenes) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria cat = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Usuario user = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        updateEntityFromDTO(producto, request, cat, user);

        if (imagenes != null) {
            producto.getImagenes().clear();
            for (MultipartFile imagen : imagenes) {
                if (imagen != null && !imagen.isEmpty()) {
                    try {
                        producto.getImagenes().add(procesarImagen(imagen));
                    } catch (IOException e) {
                        throw new RuntimeException("Error al actualizar la imagen");
                    }
                }
            }
        }

        return mapToResponseDTO(productoRepository.save(producto));
    }

    public String eliminar(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return "Producto eliminado exitosamente";
        }
        return "Error: No existe un producto con el ID " + id;
    }

    // --- LÓGICA DE MAPEO (Privada) --- Funcion adicional
    //La lógica de mapeo es un proceso de traducción que transforma los objetos 
    //de la base de datos en mensajes más simples y seguros. 
    //Su función es filtrar la información para que el usuario reciba solo los datos que necesita, 
    //ocultando detalles internos sensibles y evitando errores técnicos que podrían tildar el servidor.    

    private void updateEntityFromDTO(Producto p, ProductoRequestDTO dto, Categoria cat, Usuario user) {
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setPrecio(dto.getPrecio());
        p.setStock(dto.getStock());
        p.setCategoria(cat);
        p.setUsuario(user);
    }

    private ProductoResponseDTO mapToResponseDTO(Producto p) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setPrecio(p.getPrecio());
        dto.setStock(p.getStock());
        dto.setImagenesUrl(p.getImagenes());
        
        // Aplanamos las relaciones para el Response
        if (p.getCategoria() != null) {
            dto.setCategoriaId(p.getCategoria().getId());
            dto.setNombreCategoria(p.getCategoria().getNombreCategoria());
        }
        if (p.getUsuario() != null) {
            dto.setUsuarioId(p.getUsuario().getId());
            dto.setNombreVendedor(p.getUsuario().getNombre() + " " + p.getUsuario().getApellido());
        }
        
        return dto;
    }

    @Transactional
    public boolean validarYDescontarStock(Long id, Integer cantidadSolicitada) {
        Producto p = productoRepository.findById(id)
            .orElseThrow(() -> new RecursoNotFoundException("Producto no encontrado con ID: " + id));

        if (p.getStock() < cantidadSolicitada) {
            return false; 
        }

        p.setStock(p.getStock() - cantidadSolicitada); 
        productoRepository.save(p);
        return true;
    }

    private String procesarImagen(MultipartFile imagen) throws IOException {
        Path directorioPath = Paths.get(DIRECTORIO_IMAGENES);
        if (!Files.exists(directorioPath)) Files.createDirectories(directorioPath);
        
        String nombreArchivo = UUID.randomUUID().toString() + "_" + imagen.getOriginalFilename();
        Path rutaArchivo = directorioPath.resolve(nombreArchivo);
        Files.copy(imagen.getInputStream(), rutaArchivo);
        return nombreArchivo;
    }

    public String obtenerDestacado() {
        List<Producto> todos = productoRepository.findAll();
        if (todos.isEmpty()) return "No hay productos";
        int indexAleatorio = (int) (Math.random() * todos.size());
        return "El producto recomendado de hoy es: " + todos.get(indexAleatorio).getNombre();
    }
}