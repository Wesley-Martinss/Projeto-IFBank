package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.dto.ChaveTransferenciaDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.CriarChaveRequest;
import com.ifsp.ifBank.serverIfBank.service.ChaveTransferenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/chaves-transferencia")
@RequiredArgsConstructor
public class ChaveTransferenciaController {

    private final ChaveTransferenciaService chaveTransferenciaService;

    @GetMapping
    public ResponseEntity<?> listarMinhasChaves(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(chaveTransferenciaService.listarMinhasChaves(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<?> criarChave(@RequestBody CriarChaveRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            ChaveTransferenciaDTO criada = chaveTransferenciaService.criarChave(principal.getName(), request);
            return ResponseEntity.ok(criada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativarChave(@PathVariable Integer id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            chaveTransferenciaService.desativarChave(principal.getName(), id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
