package com.ifsp.ifBank.serverIfBank.service;


import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.UsuarioDTO;
import com.ifsp.ifBank.serverIfBank.model.mapper.UsuarioMapper;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public List<UsuarioDTO> todosOsUsuariosDTOS() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }
}
