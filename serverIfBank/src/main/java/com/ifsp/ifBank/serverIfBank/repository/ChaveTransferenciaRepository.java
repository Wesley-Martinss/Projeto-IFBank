package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChaveTransferenciaRepository extends JpaRepository<ChavesTransferencia, Integer> {
    Optional<ChavesTransferencia> findByChave(String chave);
}
