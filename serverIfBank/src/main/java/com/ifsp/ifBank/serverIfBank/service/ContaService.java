package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Investimento;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.DashboardDTO;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import com.ifsp.ifBank.serverIfBank.repository.InvestimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContaService {
    private final ContaRepository contaRepository;
    private final InvestimentoRepository investimentoRepository;

    public Conta findById(Integer id){
        return contaRepository.findById(id).orElse(null);
    }

    public boolean addNoSaldo(Conta conta, BigDecimal valor){
        if(conta == null || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0){
            return false;
        }
        BigDecimal saldoAtual = conta.getSaldo();
        BigDecimal saldoNovo = saldoAtual.add(valor);
        conta.setSaldo(saldoNovo);
        contaRepository.save(conta);
        return true;
    }

    public boolean subNoSaldo(Conta conta, BigDecimal valor){
        if(conta == null || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0){
            return false;
        }
        BigDecimal saldoAtual = conta.getSaldo();
        BigDecimal saldoNovo = saldoAtual.subtract(valor);
        if(saldoNovo.compareTo(BigDecimal.ZERO) < 0){
            return false;
        }
        conta.setSaldo(saldoNovo);
        contaRepository.save(conta);
        return true;
    }

    public Conta criarConta(Usuario usuario) {
        Conta conta = new Conta();
        conta.setUsuario(usuario);
        conta.setAgencia("0001");
        conta.setSaldo(BigDecimal.ZERO);
        conta.setAtiva(true);
        conta.setDataCriacao(LocalDateTime.now());
        conta.setNumeroConta(String.valueOf(usuario.getId()));
        return contaRepository.save(conta);
    }

    public Conta findByUsuarioId(Integer usuarioId) {
        return contaRepository.findByUsuarioId(usuarioId).orElse(null);
    }

    public DashboardDTO buscarDashboard(Integer usuarioId) {
        Conta conta = findByUsuarioId(usuarioId);
        if (conta == null) {
            return null;
        }

        BigDecimal totalInvestido = investimentoRepository
                .findByContaIdAndResgatadoFalse(conta.getId())
                .stream()
                .map(Investimento::getValorInvestido)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardDTO dto = new DashboardDTO();
        dto.setSaldo(conta.getSaldo());
        dto.setTotalInvestido(totalInvestido);
        return dto;
    }
}