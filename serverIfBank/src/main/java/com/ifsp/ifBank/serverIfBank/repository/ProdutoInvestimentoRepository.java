package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.ProdutoInvestimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoInvestimentoRepository extends JpaRepository<ProdutoInvestimento, Integer> {
    List<ProdutoInvestimento> findByAtivoTrue();
}
