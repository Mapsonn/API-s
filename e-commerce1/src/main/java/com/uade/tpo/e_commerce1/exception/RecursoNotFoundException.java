package com.uade.tpo.e_commerce1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecursoNotFoundException extends RuntimeException {
    public RecursoNotFoundException(String mensaje) {
        super(mensaje);
    }
}