package com.uade.tpo.e_commerce1.config;

import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByEmail("admin@estudio40.com")
                && !usuarioRepository.existsByUsername("adminTPO")) {
            Usuario admin = Usuario.builder()
                    .nombre("Admin")
                    .apellido("TPO")
                    .username("adminTPO")
                    .email("admin@estudio40.com")
                    .password(passwordEncoder.encode("Admin@2024!"))
                    .role(Role.ADMIN)
                    .build();
            usuarioRepository.save(admin);
            System.out.println(">>> Admin creado: admin@estudio40.com / Admin@2024!");
        }
    }
}
