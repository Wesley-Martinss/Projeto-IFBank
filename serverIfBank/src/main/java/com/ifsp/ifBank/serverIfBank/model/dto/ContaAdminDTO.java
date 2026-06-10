package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.enuns.StatusConta;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoUsuario;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ContaAdminDTO {
    private Integer id;
    private String nomeTitular;
    private String emailTitular;
    private String numeroConta;
    private String agencia;
    private BigDecimal saldo;
    private boolean ativa;
    private TipoUsuario tipoUsuario;
    private StatusConta statusConta;
}
