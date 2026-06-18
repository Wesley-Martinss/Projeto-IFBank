package com.ifsp.ifBank.serverIfBank.model.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvestimentoDTO {
    private Integer id;
    private Integer produtoId;
    private String nomeProduto;
    private BigDecimal valorInvestido;
    private BigDecimal rendimentoAcumulado;
    private BigDecimal taxaRendimentoMinuto;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Boolean resgatado;
}
