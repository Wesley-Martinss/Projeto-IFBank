package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.ChaveTransferenciaDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.CriarChaveRequest;
import com.ifsp.ifBank.serverIfBank.repository.ChaveTransferenciaRepository;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChaveTransferenciaService {

    private final ChaveTransferenciaRepository chaveTransferenciaRepository;
    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<ChaveTransferenciaDTO> listarMinhasChaves(String emailUsuario) {
        Conta conta = getContaByEmail(emailUsuario);
        return chaveTransferenciaRepository.findByContaIdOrderByDataCadastroDesc(conta.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public ChaveTransferenciaDTO criarChave(String emailUsuario, CriarChaveRequest request) {
        Conta conta = getContaByEmail(emailUsuario);

        String chave = montarValorChave(conta, request);

        if (chaveTransferenciaRepository.findByChave(chave).isPresent()) {
            throw new RuntimeException("Essa chave já está em uso.");
        }

        ChavesTransferencia nova = new ChavesTransferencia();
        nova.setConta(conta);
        nova.setChave(chave);
        nova.setAtivo(true);
        nova.setDataCadastro(LocalDateTime.now());

        ChavesTransferencia salva = chaveTransferenciaRepository.save(nova);
        return toDTO(salva);
    }

    @Transactional
    public void desativarChave(String emailUsuario, Integer chaveId) {
        Conta conta = getContaByEmail(emailUsuario);
        ChavesTransferencia chave = chaveTransferenciaRepository.findById(chaveId)
                .orElseThrow(() -> new RuntimeException("Chave não encontrada."));

        if (!chave.getConta().getId().equals(conta.getId())) {
            throw new RuntimeException("Esta chave não pertence à sua conta.");
        }

        chave.setAtivo(false);
        chaveTransferenciaRepository.save(chave);
    }

    private String montarValorChave(Conta conta, CriarChaveRequest request) {
        String tipo = request.getTipo() == null ? "" : request.getTipo().toUpperCase();

        return switch (tipo) {
            case "ALEATORIA" -> UUID.randomUUID().toString();
            case "EMAIL" -> {
                String email = conta.getUsuario().getEmail();
                if (request.getValor() == null || !request.getValor().equalsIgnoreCase(email)) {
                    throw new RuntimeException("Só é possível cadastrar como chave o e-mail da sua própria conta.");
                }
                yield email;
            }
            case "CPF" -> {
                String cpf = conta.getUsuario().getCpf();
                if (request.getValor() == null || !request.getValor().equals(cpf)) {
                    throw new RuntimeException("Só é possível cadastrar como chave o CPF da sua própria conta.");
                }
                yield cpf;
            }
            case "TELEFONE" -> {
                if (request.getValor() == null || request.getValor().isBlank()) {
                    throw new RuntimeException("Informe um telefone válido.");
                }
                yield request.getValor();
            }
            default -> throw new RuntimeException("Tipo de chave inválido. Use EMAIL, CPF, TELEFONE ou ALEATORIA.");
        };
    }

    private Conta getContaByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return contaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada."));
    }

    private ChaveTransferenciaDTO toDTO(ChavesTransferencia entity) {
        ChaveTransferenciaDTO dto = new ChaveTransferenciaDTO();
        dto.setId(entity.getId());
        dto.setChave(entity.getChave());
        dto.setAtivo(entity.isAtivo());
        return dto;
    }
}
