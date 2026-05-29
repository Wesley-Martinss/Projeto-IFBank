package com.ifsp.ifBank.serverIfBank.model;


import com.ifsp.ifBank.serverIfBank.model.enuns.TipoInvestimento;
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

    @Enumerated(EnumType.STRING)
    private TipoInvestimento tipoInvestimento;

    private BigDecimal valorInvestido;

    private BigDecimal rendimento;

    private Integer duracaoDias;

    private LocalDateTime dataInicio;

    private LocalDateTime dataFim;

    private LocalDateTime dataCadastro;
}