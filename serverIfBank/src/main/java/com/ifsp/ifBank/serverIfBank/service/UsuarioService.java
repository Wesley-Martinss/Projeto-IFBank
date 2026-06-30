package com.ifsp.ifBank.serverIfBank.service;


import java.time.LocalDateTime;
import java.util.List;

import com.ifsp.ifBank.serverIfBank.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioDTO buscarPorId(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return usuarioMapper.toDTO(usuario);
    }

    public List<UsuarioDTO> todosOsUsuariosDTOS() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }


    public UsuarioDTO login(LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos!"));

        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha incorretos!");
        }

        if (usuario.getStatusConta() != StatusConta.ATIVA) {
            throw new RuntimeException("Conta não está ativa!");
        }

        UsuarioDTO dto = usuarioMapper.toDTO(usuario);

        String token = jwtService.gerarToken(usuario.getId(), usuario.getEmail(), usuario.getTipoUsuario().name(), usuario.getNome());
        dto.setToken(token);
        dto.setFoto(usuario.getFoto());

        return dto;
    }

    public UsuarioDTO cadastrar (Usuario usuario){
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe uma conta cadastrada com este e-mail.");
        }

        usuario.setTipoUsuario(TipoUsuario.CLIENTE);

        usuario.setStatusConta(StatusConta.PENDENTE_APROVACAO);

        usuario.setAtivo(true);

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

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


    public Usuario buscarUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    @Transactional
    public Usuario atualizarPerfil(Integer id, Usuario dadosAtualizados) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setNome(dadosAtualizados.getNome());
        usuario.setEmail(dadosAtualizados.getEmail());
        usuario.setTelefone(dadosAtualizados.getTelefone());
        usuario.setEndereco(dadosAtualizados.getEndereco());
        usuario.setDataNascimento(dadosAtualizados.getDataNascimento());

        // CPF, senha, statusConta, ativo NÃO são atualizados por aqui — propositalmente.

        if (dadosAtualizados.getFoto() != null) {
            usuario.setFoto(dadosAtualizados.getFoto());
        }

        return usuarioRepository.save(usuario);
    }
}
