package com.ifsp.ifBank.serverIfBank.model;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MovimentacoesConta {
    private Integer id;
    private Usuario remetente;
    private Conta contaRemente;
    // essa pode ser null
    private Conta contaDestinatario;

    private boolean deposito;
    private boolean sacar;
    private LocalDateTime dataMovimentacao;
    private float valor;



}
