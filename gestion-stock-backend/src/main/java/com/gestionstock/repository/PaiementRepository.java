package com.gestionstock.repository;

import com.gestionstock.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    Optional<Paiement> findByVente_Id(Long venteId);
    void deleteByVente_Id(Long venteId);
}
