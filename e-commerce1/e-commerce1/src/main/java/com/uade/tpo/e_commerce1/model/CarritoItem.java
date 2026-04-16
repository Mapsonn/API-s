package com.uade.tpo.e_commerce1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Data   
@AllArgsConstructor 
@NoArgsConstructor  

public class CarritoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne // Muchos ítems pueden ser del mismo producto 
    @JoinColumn(name = "producto_id")
    @NotNull(message = "El producto es obligatorio")
    private Producto producto;

    @ManyToOne // Muchos ítems pueden pertenecer a un mismo usuario 
    @JoinColumn(name = "usuario_id")
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    @Min(value = 1, message = "La cantidad mínima debe ser 1")
    @NotNull(message = "La cantidad es obligatoria")
    private Integer cantidad;
}
