package com.uade.tpo.e_commerce1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {
    
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    
}