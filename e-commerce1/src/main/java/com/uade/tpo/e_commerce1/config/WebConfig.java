package com.uade.tpo.e_commerce1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//Esta clase sirve para que React reconozca los puertos del backend
//y pueda existir una comunicacion entre el backend y el frontend
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permitir todas las rutas (productos, usuarios, etc)
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Puertos comunes de React/Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Métodos permitidos
                .allowedHeaders("*") // Permitir todos los encabezados
                .allowCredentials(true); 
    }

   
 @Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 1. Obtenemos la ruta absoluta a la carpeta "imagenes"
    String userDir = System.getProperty("user.dir");
    java.nio.file.Path path = java.nio.file.Paths.get(userDir, "imagenes");
    String rutaAbsoluta = path.toUri().toString(); // Esto genera un "file:/C:/..." perfecto

    System.out.println("----------------------------------------------");
    System.out.println("SERVIDOR BUSCANDO EN: " + rutaAbsoluta);
    System.out.println("----------------------------------------------");

    // 2. Mapeamos la URL
    registry.addResourceHandler("/imagenes/**")
            .addResourceLocations(rutaAbsoluta + "/")
            .setCachePeriod(0);
}
}