package com.gestionstock.repository;

import com.gestionstock.entity.LigneVente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LigneVenteRepository extends JpaRepository<LigneVente, Long> {
    List<LigneVente> findByVente_Id(Long venteId);
    void deleteByVente_Id(Long venteId);
}
