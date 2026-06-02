package com.ifsp.ifBank.serverIfBank.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.LoginDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.UsuarioDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.StatusConta;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoUsuario;
import com.ifsp.ifBank.serverIfBank.model.mapper.UsuarioMapper;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final ContaService contaService;


    public List<UsuarioDTO> todosOsUsuariosDTOS() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }

    public UsuarioDTO login(LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmailAndSenha(loginDTO.getEmail(), loginDTO.getSenha())
            .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos!"));
            
        if (usuario.getStatusConta() != StatusConta.ATIVA) {
            throw new RuntimeException("Conta não está ativa!");
        }
        
        return usuarioMapper.toDTO(usuario);
    }

    public UsuarioDTO cadastrar (Usuario usuario){
        usuario.setTipoUsuario(TipoUsuario.CLIENTE);
        
        usuario.setStatusConta(StatusConta.PENDENTE_APROVACAO);
        
        usuario.setAtivo(true);

        usuario.setDataCadastro(LocalDateTime.now());

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return usuarioMapper.toDTO(usuarioSalvo);
    }

    public List<UsuarioDTO> listaContasPendentes() {
        return usuarioRepository.findByStatusConta(StatusConta.PENDENTE_APROVACAO)
                .stream()
                .map(usuarioMapper::toDTO) //O operador :: em Java é conhecido como Method Reference (Referência de Método). Ele é uma forma simplificada e elegante de escrever expressões lambda, geralmente usado em conjunto com a Streams API ou para passar métodos como argumentos
                .toList();
    }

    @Transactional
    public void aprovarConta(Integer usuarioId, Integer gerenteId){
        //Valida se é gerente
        Usuario gerente = usuarioRepository.findById(gerenteId)
            .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));

        if (gerente.getTipoUsuario() != TipoUsuario.GERENTE) {
            throw new RuntimeException("Apenas gerentes podem aprovar!");
        }

        //Buscar o cliente à ser aprovada
        Usuario cliente = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Cliente penedentte não encontrado"));

        if (cliente.getStatusConta() != StatusConta.PENDENTE_APROVACAO) {
            throw new RuntimeException("Conta não pendente de aprovação");
        }

        //Ativar conta
        cliente.setStatusConta(StatusConta.ATIVA);
        usuarioRepository.save(cliente);

        //Criar  a conta associada
        contaService.criarConta(cliente);
    }

}
