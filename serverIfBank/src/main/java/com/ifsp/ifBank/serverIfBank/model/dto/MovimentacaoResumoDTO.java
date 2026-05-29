package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MovimentacaoResumoDTO {
    private TipoMovimentacao tipoMovimentacao;

    private BigDecimal valor;

    private String descricao;

    private LocalDateTime dataMovimentacao;
}

