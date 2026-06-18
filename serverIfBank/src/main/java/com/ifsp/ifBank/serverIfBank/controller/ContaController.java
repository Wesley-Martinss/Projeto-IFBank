package com.ifsp.ifBank.serverIfBank.controller;


import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.service.AdminService;
import com.ifsp.ifBank.serverIfBank.service.ContaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;

    @GetMapping("/por-usuario/{usuarioId}")
    public ResponseEntity<Conta> buscarPorUsuario(@PathVariable("usuarioId") Integer usuarioId) {
        Conta conta = contaService.findByUsuarioId(usuarioId);
        if (conta == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(conta);
    }
}
