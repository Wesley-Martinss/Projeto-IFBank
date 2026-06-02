package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContaService {
    private final ContaRepository contaRepository;

    public Conta findById(Integer id){
        return contaRepository.findById(id).orElse(null);
    }

    public boolean addNoSaldo(Conta conta, BigDecimal valor){
        if(conta != null) {
            BigDecimal saldoAtual = conta.getSaldo();
            BigDecimal saldoNovo = saldoAtual.add(valor);
            conta.setSaldo(saldoNovo);
            contaRepository.save(conta);
            return true;
        }

        return false;

    }

    public boolean subNoSaldo(Conta conta, BigDecimal valor){
        if(conta != null) {
            BigDecimal saldoAtual = conta.getSaldo();
            BigDecimal saldoNovo = saldoAtual.subtract(valor);
            conta.setSaldo(saldoNovo);
            contaRepository.save(conta);
            return true;
        }

        return false;

    }

    public Conta criarConta(Usuario usuario) {
        Conta conta = new Conta();
        conta.setUsuario(usuario);
        conta.setAgencia("0001"); // Agência padrão    
        conta.setSaldo(BigDecimal.ZERO);
        conta.setAtiva(true);
        conta.setDataCriacao(LocalDateTime.now());
        
        // Usa o ID do próprio usuário como número da conta. 
        // Como cada usuário tem 1 conta, o número sempre será único e já existe antes de salvar!
        conta.setNumeroConta(String.valueOf(usuario.getId()));
        
        return contaRepository.save(conta);
    }

}
