package com.gestionstock.repository;

import com.gestionstock.entity.CreditClient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreditClientRepository extends JpaRepository<CreditClient, Long> {
    Optional<CreditClient> findByVente_Id(Long venteId);
    void deleteByVente_Id(Long venteId);
}
