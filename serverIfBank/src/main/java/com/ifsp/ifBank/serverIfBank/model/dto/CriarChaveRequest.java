package com.ifsp.ifBank.serverIfBank.model.dto;

import lombok.Data;

@Data
public class CriarChaveRequest {
    // Tipo da chave: "EMAIL", "CPF", "TELEFONE" ou "ALEATORIA"
    private String tipo;

    // Valor da chave quando tipo != ALEATORIA (e-mail, cpf ou telefone)
    private String valor;
}
