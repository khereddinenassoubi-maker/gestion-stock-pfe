package com.gestionstock.repository;

import com.gestionstock.entity.PaiementClient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaiementClientRepository extends JpaRepository<PaiementClient, Long> {
    List<PaiementClient> findByClient_IdOrderByDatePaiementDesc(Long clientId);
}
