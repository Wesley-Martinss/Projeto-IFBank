package com.ifsp.ifBank.serverIfBank.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.LoginDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.UsuarioDTO;
import com.ifsp.ifBank.serverIfBank.service.UsuarioService;

import lombok.RequiredArgsConstructor;

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

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody LoginDTO loginDTO) {
        try {
            UsuarioDTO usuarioLogado = usuarioService.login(loginDTO);
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Retorna 401 se der erro
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody Usuario usuario){
        UsuarioDTO novoUsuario = usuarioService.cadastrar(usuario);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(novoUsuario);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<UsuarioDTO>> listarContasPendentes() {
        List<UsuarioDTO> pendentes = usuarioService.listaContasPendentes();

        return ResponseEntity.ok(pendentes);
    }

    @PostMapping("/aprovar/{usuarioId}")
    public ResponseEntity<Void> aprovarConta(@PathVariable Integer usuarioId, @RequestParam Integer gerenteId){
        try {
            usuarioService.aprovarConta(usuarioId, gerenteId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}