package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<MovimentacaoConta, Integer> {
    List<MovimentacaoConta> findByContaOrigemIdOrContaDestinoIdOrderByDataMovimentacaoDesc(Integer contaOrigemId, Integer contaDestinoId);
}
