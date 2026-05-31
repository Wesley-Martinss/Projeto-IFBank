package com.ifsp.ifBank.serverIfBank.model;


import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "movimentacao_conta")
public class    MovimentacaoConta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "conta_origem_id")
    private Conta contaOrigem;

    @ManyToOne
    @JoinColumn(name = "conta_destino_id")
    private Conta contaDestino;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimentacao;

    private BigDecimal valor;

    private String descricao;

    private LocalDateTime dataMovimentacao;

    private String tipoOperacao; // "ENTRADA" ou "SAIDA"
}