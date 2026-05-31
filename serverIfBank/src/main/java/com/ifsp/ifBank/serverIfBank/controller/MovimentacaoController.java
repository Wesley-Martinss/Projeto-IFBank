package com.ifsp.ifBank.serverIfBank.controller;


import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoDTO;
import com.ifsp.ifBank.serverIfBank.service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping
    public ResponseEntity<Boolean> movimentar(
            @RequestBody MovimentacaoDTO dto){

        MovimentacaoConta movimentacao =
                movimentacaoService.realizarMovimentacao(dto);

        if(movimentacao == null){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(true);
    }
}
