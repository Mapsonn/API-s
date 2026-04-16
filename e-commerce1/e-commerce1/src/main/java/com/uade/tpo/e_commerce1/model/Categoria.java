package com.uade.tpo.e_commerce1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity 
@Data   
@AllArgsConstructor 
@NoArgsConstructor  

public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la categoría no puede estar vacío")
    private String nombreCategoria;


    //Una categoria puede tener muchos productos
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Producto> productos;
}
