package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class FotoController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/{id}/foto")
    public ResponseEntity<String> salvarFoto(
            @PathVariable Integer id,
            @RequestBody String base64) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setFoto(base64);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(base64);
    }
}