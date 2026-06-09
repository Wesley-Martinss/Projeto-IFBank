package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.ContaAdminDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoAdminDTO;
import com.ifsp.ifBank.serverIfBank.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/contas")
    public ResponseEntity<List<ContaAdminDTO>> listarContas() {
        return ResponseEntity.ok(adminService.listarContas());
    }

    @GetMapping("/movimentacoes")
    public ResponseEntity<List<MovimentacaoAdminDTO>> listarMovimentacoes() {
        return ResponseEntity.ok(adminService.listarMovimentacoes());
    }

    @PostMapping("/gerentes")
    public ResponseEntity<String> criarGerente(@RequestBody Usuario usuario) {
        try {
            adminService.criarGerente(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body("Gerente criado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar gerente: " + e.getMessage());
        }
    }
}
