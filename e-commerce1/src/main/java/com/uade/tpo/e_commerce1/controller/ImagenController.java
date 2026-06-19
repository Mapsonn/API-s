package com.uade.tpo.e_commerce1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/imagenes")
@CrossOrigin(origins = "http://localhost:5173")
public class ImagenController {

    @PostMapping("/subir")
    public ResponseEntity<String> subirImagen(@RequestParam("file") MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }

        try {
            // 1. Definimos la carpeta (la misma que ya tenés)
            String carpetaDestino = System.getProperty("user.dir") + "/imagenes/";
            File directorio = new File(carpetaDestino);
            if (!directorio.exists()) directorio.mkdirs();

            // 2. Generamos un nombre único para que no se pisen fotos con el mismo nombre
            String nombreOriginal = archivo.getOriginalFilename();
            String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            String nuevoNombre = UUID.randomUUID().toString() + extension;

            // 3. Guardamos el archivo físico
            Path rutaCompleta = Paths.get(carpetaDestino + nuevoNombre);
            Files.write(rutaCompleta, archivo.getBytes());

            // 4. Devolvemos el nombre del archivo para que React lo guarde en el Producto
            return ResponseEntity.ok(nuevoNombre);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al subir: " + e.getMessage());
        }
    }
}