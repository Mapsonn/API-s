package com.uade.tpo.e_commerce1.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo crear la carpeta de imágenes", ex);
        }
    }

    public String guardarArchivo(MultipartFile archivo) {
        String nombreOriginal = StringUtils.cleanPath(archivo.getOriginalFilename());
        String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        // Generamos un nombre único para que no se pisen archivos con el mismo nombre
        String nombreArchivoUnico = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(nombreArchivoUnico);
            Files.copy(archivo.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return nombreArchivoUnico;
        } catch (IOException ex) {
            throw new RuntimeException("Error al guardar el archivo", ex);
        }
    }
}