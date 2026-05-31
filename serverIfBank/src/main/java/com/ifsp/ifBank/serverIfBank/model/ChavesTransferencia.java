package com.ifsp.ifBank.serverIfBank.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chaves_transferencia")
public class ChavesTransferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    private Conta conta;

    @Column(name = "chave_transferencia")
    private String chave;

    private boolean ativo;

    private LocalDateTime dataCadastro;
}