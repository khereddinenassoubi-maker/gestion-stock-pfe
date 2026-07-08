package com.gestionstock.repository;

import com.gestionstock.entity.LigneAchat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LigneAchatRepository extends JpaRepository<LigneAchat, Long> {

    List<LigneAchat> findByAchat_Id(Long achatId);

    void deleteByAchat_Id(Long achatId);
}