package com.uade.tpo.e_commerce1.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
//Esta clase permite que springboot utilice imagenes desde una carpeta fisica
//Y asegura que las mismas se mantengan en el servidor y no se borren ante un reinicio del mismo
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtenemos la ruta absoluta de tu carpeta de imágenes
        Path uploadDirPath = Paths.get(uploadDir);
        String uploadPath = uploadDirPath.toFile().getAbsolutePath();

        // Cuando alguien pida "/api/imagenes/**" en el navegador...
        // Spring va a ir a buscar el archivo real a la carpeta física de la computadora
        registry.addResourceHandler("/api/imagenes/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Puertos de React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH");
    }
}