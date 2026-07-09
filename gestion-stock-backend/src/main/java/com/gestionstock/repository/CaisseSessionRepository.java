package com.gestionstock.repository;

import com.gestionstock.entity.CaisseSession;
import com.gestionstock.enums.StatutCaisse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaisseSessionRepository extends JpaRepository<CaisseSession, Long> {
    Optional<CaisseSession> findFirstByCaissierNomAndStatutOrderByDateOuvertureDesc(String caissierNom, StatutCaisse statut);
}
