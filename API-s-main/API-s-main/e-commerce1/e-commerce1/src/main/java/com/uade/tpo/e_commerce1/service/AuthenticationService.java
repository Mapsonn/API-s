package com.uade.tpo.e_commerce1.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce1.dto.AuthResponse;
import com.uade.tpo.e_commerce1.dto.LoginRequest;
import com.uade.tpo.e_commerce1.dto.RegisterRequest;
import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import com.uade.tpo.e_commerce1.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Registro de nuevo usuario. Retorna un String de éxito.
     */
    public String register(RegisterRequest request) {

        // 1. Validación de email único
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe en la base de datos");
        }

        // 2. Construcción del objeto Usuario Adaptado a ManyToMany
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        // 3. Persistencia
        usuarioRepository.save(usuario);
        
        return "User registered successfully";
    }

    /**
     * Autenticación de usuario. Retorna AuthResponse con token y datos del usuario.
     */
    public AuthResponse authenticate(LoginRequest request) {

        // 1. Validar credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // 2. Obtener usuario de la base de datos
        Usuario user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 3. Extraer roles para meterlos en el token
        Set<String> roles = user.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toSet());

        // 4. Generar token y devolver respuesta completa
        String token = jwtUtil.generateToken(user.getEmail(), roles);
        return new AuthResponse(token, user.getId(), user.getNombre(), user.getApellido(), user.getEmail(), user.getRole().name());
    }
}