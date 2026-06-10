package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Integer> {
    Optional<Conta> findByUsuarioId(Long usuarioId);
}
