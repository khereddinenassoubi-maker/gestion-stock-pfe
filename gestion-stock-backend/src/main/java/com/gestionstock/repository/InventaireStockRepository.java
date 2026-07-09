package com.gestionstock.repository;

import com.gestionstock.entity.InventaireStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventaireStockRepository extends JpaRepository<InventaireStock, Long> {
}
