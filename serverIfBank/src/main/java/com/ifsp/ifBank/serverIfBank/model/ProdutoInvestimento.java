package com.ifsp.ifBank.serverIfBank.model;

import com.ifsp.ifBank.serverIfBank.model.enuns.TipoInvestimento;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "produto_investimento")
public class ProdutoInvestimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoInvestimento tipoInvestimento;

    private BigDecimal taxaRendimentoMinuto;

    private Integer prazoMinutos;

    private BigDecimal valorMinimo;

    private Boolean ativo = true;

    private LocalDateTime dataCadastro = LocalDateTime.now();
}
