package com.ifsp.ifBank.serverIfBank.model;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Investimento {
    private Integer id;
    private Conta conta;
    private Double valorInvestido = 0.0;
    private String nome;
    private int duracao;
    private LocalDateTime dataInicio;
    //data fim pode ser nula
    private LocalDateTime dataFim;
    private LocalDateTime dataCadastro;
    private boolean ativo;

}
