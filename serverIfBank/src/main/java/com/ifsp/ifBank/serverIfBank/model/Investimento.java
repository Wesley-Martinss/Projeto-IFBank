package com.ifsp.ifBank.serverIfBank.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "investimento")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    private Conta conta;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private ProdutoInvestimento produto;

    private BigDecimal valorInvestido;

    private BigDecimal rendimento;

    private LocalDateTime dataInicio;

    private LocalDateTime dataFim;

    private LocalDateTime dataCadastro;

    private Boolean resgatado = false;
}