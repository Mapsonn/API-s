package com.uade.tpo.e_commerce1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Data   
@AllArgsConstructor 
@NoArgsConstructor  

public class FavoritoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "producto_id")
    @NotNull(message = "El producto es obligatorio")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;
}
