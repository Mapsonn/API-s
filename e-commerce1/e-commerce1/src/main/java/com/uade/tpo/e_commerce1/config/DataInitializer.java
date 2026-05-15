package com.uade.tpo.e_commerce1.config;

import com.uade.tpo.e_commerce1.model.Role;
import com.uade.tpo.e_commerce1.model.Usuario;
import com.uade.tpo.e_commerce1.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!usuarioRepository.existsByEmail("admin@mail.com")) {
            Usuario admin = Usuario.builder()
                    .nombre("Admin")
                    .apellido("TPO")
                    .username("admin")
                    .email("admin@mail.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(Role.ADMIN)
                    .build();
            usuarioRepository.save(admin);
            System.out.println(">>> Admin creado: admin@mail.com / Admin123!");
        }
    }
}
