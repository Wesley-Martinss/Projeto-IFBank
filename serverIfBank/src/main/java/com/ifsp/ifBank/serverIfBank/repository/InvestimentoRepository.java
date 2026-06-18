package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestimentoRepository extends JpaRepository<Investimento, Integer> {
    List<Investimento> findByContaId(Integer contaId);
}
