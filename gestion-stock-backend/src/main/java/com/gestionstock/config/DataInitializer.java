package com.gestionstock.config;

import com.gestionstock.entity.Administrateur;
import com.gestionstock.enums.Role;
import com.gestionstock.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public void run(String... args) {
        if (utilisateurRepository.findByUsername("admin").isPresent()) {
            return;
        }

        Administrateur admin = new Administrateur();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setNom("Administrateur");
        admin.setPrenom("");
        admin.setEmail("");
        admin.setRole(Role.ADMIN);
        admin.setActif(true);
        admin.setDepartement("Administration");
        utilisateurRepository.save(admin);
    }
}
