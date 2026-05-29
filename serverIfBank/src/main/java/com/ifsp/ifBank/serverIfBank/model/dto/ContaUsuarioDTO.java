package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class ContaUsuarioDTO {

    private UsuarioDTO usuario;

    private String numeroConta;

    private String agencia;


    private BigDecimal saldo;

    private List<ChaveTransferenciaDTO> chavesTransferencia;

    private List<MovimentacaoResumoDTO> ultimasMovimentacoes;
}