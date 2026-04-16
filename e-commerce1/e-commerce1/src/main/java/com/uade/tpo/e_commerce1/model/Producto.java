package com.uade.tpo.e_commerce1.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Esto le avisa a Spring que Producto será una tabla en SQL
@Data   // Creacion de getters y setters con Lombok
@AllArgsConstructor // Crea un constructor con todos los atributos
@NoArgsConstructor  // Crea un constructor vacío (obligatorio para JPA)
public class Producto {

    @Id // Marca este campo como la llave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // El ID se genera solo
    private Long id;

    @NotBlank(message = "El nombre no puede ser nulo o vacío")
    private String nombre;

    @NotNull(message = "El precio no puede ser nulo")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private Double precio;

    private Integer stock;
    private String descripcion;

    @ManyToOne // Muchos productos pertenecen a una misma categoría
    @JoinColumn(name = "categoria_id") // Nombre de la columna en la tabla SQL
    @NotNull(message = "La categoría es obligatoria")
    private Categoria categoria;
    
    @Column(name = "imagen_url")
    private String imagenUrl; // Guardará el nombre único del archivo

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"password", "productos"}) 
    private Usuario usuario; // El dueño del producto
}