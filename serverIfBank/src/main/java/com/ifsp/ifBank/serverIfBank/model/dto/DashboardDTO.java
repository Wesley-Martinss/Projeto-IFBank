package com.ifsp.ifBank.serverIfBank.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardDTO {
    private BigDecimal saldo;
    private BigDecimal totalInvestido;
}
