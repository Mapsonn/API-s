package com.uade.tpo.e_commerce1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequestDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long categoriaId; // ID para vincular en el Service
    private Long usuarioId;   // ID del vendedor
}