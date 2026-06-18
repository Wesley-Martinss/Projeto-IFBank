package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.enuns.TipoInvestimento;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoInvestimentoDTO {
    private Integer id;
    private String nome;
    private TipoInvestimento tipoInvestimento;
    private BigDecimal taxaRendimentoMinuto;
    private Integer prazoMinutos;
    private BigDecimal valorMinimo;
    private Boolean ativo;
}
