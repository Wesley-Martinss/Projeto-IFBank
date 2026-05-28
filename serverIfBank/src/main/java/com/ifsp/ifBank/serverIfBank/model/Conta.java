package com.ifsp.ifBank.serverIfBank.model;

import lombok.Data;

@Data
public class Conta {
    private Integer id;
    private Usuario usuario;
    private float saldo;
    private boolean ativo;
}
