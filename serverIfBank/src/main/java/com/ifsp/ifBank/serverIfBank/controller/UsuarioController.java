package com.ifsp.ifBank.serverIfBank.controller;

import java.util.List;

import com.ifsp.ifBank.serverIfBank.model.mapper.UsuarioMapper;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuariosDTOS() {

        List<UsuarioDTO> usuarios =
                usuarioService.todosOsUsuariosDTOS();

        return ResponseEntity.ok(usuarios);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarPerfil(@PathVariable Integer id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.atualizarPerfil(id, usuario));
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
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario){
        try {
            UsuarioDTO novoUsuario = usuarioService.cadastrar(usuario);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<UsuarioDTO>> listarContasPendentes() {
        List<UsuarioDTO> pendentes = usuarioService.listaContasPendentes();

        return ResponseEntity.ok(pendentes);
    }

    @PostMapping("/aprovar/{usuarioId}")
    public ResponseEntity<String> aprovarConta(@PathVariable("usuarioId") Integer usuarioId, @RequestParam("gerenteId") Integer gerenteId){
        try {
            usuarioService.aprovarConta(usuarioId, gerenteId);
            return ResponseEntity.ok("Sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erro Runtime: " + e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Erro Interno: " + ex.getClass().getName() + " - " + ex.getMessage());
    }
}