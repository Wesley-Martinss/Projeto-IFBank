package com.ifsp.ifBank.serverIfBank.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String numeroConta;

    private String agencia;

    private BigDecimal saldo;

    private boolean ativa;

    private LocalDateTime dataCriacao;


}