package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MovimentacaoDTO {

    private Integer idContaOrigem;

    private String chaveDestinatario;

    private Integer idContaDestinatario;

    private String nomeContaDestinatario;

    private BigDecimal valor;

    private String descricao;

    private TipoMovimentacao tipoMovimentacao;

    private Integer idProdutoInvestimento;
}