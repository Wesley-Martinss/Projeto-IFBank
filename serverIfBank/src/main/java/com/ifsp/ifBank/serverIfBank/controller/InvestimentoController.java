package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.dto.InvestimentoDTO;
import com.ifsp.ifBank.serverIfBank.service.InvestimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/investimentos")
@RequiredArgsConstructor
public class InvestimentoController {

    private final InvestimentoService investimentoService;

    @GetMapping("/meus-investimentos")
    public ResponseEntity<?> listarMeusInvestimentos(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            List<InvestimentoDTO> investimentos = investimentoService.listarMeusInvestimentos(principal.getName());
            return ResponseEntity.ok(investimentos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/resgatar")
    public ResponseEntity<InvestimentoDTO> resgatarInvestimento(@PathVariable("id") Integer id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            InvestimentoDTO resgatado = investimentoService.resgatar(id, principal.getName());
            return ResponseEntity.ok(resgatado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
