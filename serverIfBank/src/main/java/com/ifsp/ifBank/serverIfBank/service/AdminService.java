package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.ContaAdminDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoAdminDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.StatusConta;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoUsuario;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import com.ifsp.ifBank.serverIfBank.repository.MovimentacaoRepository;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ContaRepository contaRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ContaAdminDTO> listarContas() {
        return contaRepository.findAll()
                .stream()
                .map(this::toContaAdminDTO)
                .toList();
    }

    public List<MovimentacaoAdminDTO> listarMovimentacoes() {
        return movimentacaoRepository.findAll()
                .stream()
                .map(this::toMovimentacaoAdminDTO)
                .toList();
    }

    public void criarGerente(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe uma conta cadastrada com este e-mail.");
        }
        usuario.setTipoUsuario(TipoUsuario.GERENTE);
        usuario.setStatusConta(StatusConta.ATIVA);
        usuario.setAtivo(true);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setDataCadastro(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    private ContaAdminDTO toContaAdminDTO(Conta conta) {
        ContaAdminDTO dto = new ContaAdminDTO();
        dto.setId(conta.getId());
        dto.setNumeroConta(conta.getNumeroConta());
        dto.setAgencia(conta.getAgencia());
        dto.setSaldo(conta.getSaldo());
        dto.setAtiva(conta.isAtiva());

        if (conta.getUsuario() != null) {
            dto.setNomeTitular(conta.getUsuario().getNome());
            dto.setEmailTitular(conta.getUsuario().getEmail());
            dto.setTipoUsuario(conta.getUsuario().getTipoUsuario());
            dto.setStatusConta(conta.getUsuario().getStatusConta());
        }

        return dto;
    }

    private MovimentacaoAdminDTO toMovimentacaoAdminDTO(MovimentacaoConta m) {
        MovimentacaoAdminDTO dto = new MovimentacaoAdminDTO();
        dto.setId(m.getId());
        dto.setDataMovimentacao(m.getDataMovimentacao());
        dto.setTipoMovimentacao(m.getTipoMovimentacao());
        dto.setValor(m.getValor());
        dto.setDescricao(m.getDescricao());

        if (m.getContaOrigem() != null) {
            dto.setNumeroContaOrigem(m.getContaOrigem().getNumeroConta());
            if (m.getContaOrigem().getUsuario() != null) {
                dto.setNomeTitularOrigem(m.getContaOrigem().getUsuario().getNome());
            }
        }

        if (m.getContaDestino() != null) {
            dto.setNumeroContaDestino(m.getContaDestino().getNumeroConta());
            if (m.getContaDestino().getUsuario() != null) {
                dto.setNomeTitularDestino(m.getContaDestino().getUsuario().getNome());
            }
        }

        return dto;
    }
}
