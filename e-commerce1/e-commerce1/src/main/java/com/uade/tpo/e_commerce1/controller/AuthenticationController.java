package com.uade.tpo.e_commerce1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce1.dto.LoginRequest;
import com.uade.tpo.e_commerce1.dto.RegisterRequest;
import com.uade.tpo.e_commerce1.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request // DTO de registro
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticate(
            @RequestBody LoginRequest request // DTO de login
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}