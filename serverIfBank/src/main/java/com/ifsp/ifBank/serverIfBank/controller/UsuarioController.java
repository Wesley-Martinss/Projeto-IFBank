package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.dto.UsuarioDTO;
import com.ifsp.ifBank.serverIfBank.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuariosDTOS() {

        List<UsuarioDTO> usuarios =
                usuarioService.todosOsUsuariosDTOS();

        return ResponseEntity.ok(usuarios);
    }
}