package com.uade.tpo.e_commerce1.service;

import com.uade.tpo.e_commerce1.dto.LoginRequest;
import com.uade.tpo.e_commerce1.dto.RegisterRequest;
import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import com.uade.tpo.e_commerce1.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void register_WhenEmailAlreadyExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest("Juan", "Perez", "juan@mail.com", "juanp", "secret");
        when(usuarioRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenticationService.register(request));

        assertEquals("El email ya existe en la base de datos", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void register_WhenEmailIsNew_SavesUserAndReturnsSuccessMessage() {
        RegisterRequest request = new RegisterRequest("Ana", "Lopez", "ana@mail.com", "analo", "Password!1");
        when(usuarioRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        String result = authenticationService.register(request);

        assertEquals("User registered successfully", result);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        Usuario saved = captor.getValue();

        assertEquals("Ana", saved.getNombre());
        assertEquals("Lopez", saved.getApellido());
        assertEquals("ana@mail.com", saved.getUsername());
        assertEquals("ana@mail.com", saved.getEmail());
        assertEquals("encodedPassword", saved.getPassword());
        assertEquals(Role.USER, saved.getRole());
    }

    @Test
    void authenticate_WhenCredentialsAreValid_ReturnsJwtToken() {
        LoginRequest request = new LoginRequest("admin@mail.com", "secret");

        Usuario user = Usuario.builder()
                .id(1L)
                .email("admin@mail.com")
                .password("hashed")
                .nombre("Admin")
                .apellido("Root")
                .role(Role.ADMIN)
                .build();

        when(usuarioRepository.findByEmail("admin@mail.com")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(eq("admin@mail.com"), any(Set.class))).thenReturn("jwt-token");

        String token = authenticationService.authenticate(request);

        assertEquals("jwt-token", token);

        ArgumentCaptor<UsernamePasswordAuthenticationToken> authCaptor =
                ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
        verify(authenticationManager).authenticate(authCaptor.capture());
        UsernamePasswordAuthenticationToken authToken = authCaptor.getValue();

        assertEquals("admin@mail.com", authToken.getPrincipal());
        assertEquals("secret", authToken.getCredentials());
        verify(jwtUtil).generateToken(eq("admin@mail.com"), any(Set.class));
    }

    @Test
    void authenticate_WhenUserIsNotFound_ThrowsException() {
        LoginRequest request = new LoginRequest("nouser@mail.com", "secret");
        when(usuarioRepository.findByEmail("nouser@mail.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenticationService.authenticate(request));

        assertTrue(ex.getMessage().contains("Usuario no encontrado"));
        verify(jwtUtil, never()).generateToken(any(), any());
    }
}
