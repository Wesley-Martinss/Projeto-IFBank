package com.ifsp.ifBank.serverIfBank.controller;


import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoResumoDTO;
import com.ifsp.ifBank.serverIfBank.service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {
    private final MovimentacaoService movimentacaoService;


    @PostMapping("/validar-destinatario")
    public ResponseEntity<MovimentacaoDTO> validarDestinatario(@RequestParam(required = true) String chaveDestinatario) {
        if (chaveDestinatario == null || chaveDestinatario.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        MovimentacaoDTO movimentacaoDTO = movimentacaoService.procuraDestinatarioParaCriarNovaMovimentacao(chaveDestinatario);

        if (movimentacaoDTO == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(movimentacaoDTO);

    }

    @GetMapping("/extrato")
    public ResponseEntity<List<MovimentacaoResumoDTO>> extrato(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(movimentacaoService.listarMinhasMovimentacoes(principal.getName()));
    }


    @PostMapping
    public ResponseEntity<?> movimentar(
            @RequestBody MovimentacaoDTO dto,
            Principal principal){

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            MovimentacaoConta movimentacao =
                    movimentacaoService.realizarMovimentacao(dto, principal.getName());

            if(movimentacao == null){
                return ResponseEntity.badRequest().body("Não foi possível realizar a movimentação.");
            }

            return ResponseEntity.ok(true);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
