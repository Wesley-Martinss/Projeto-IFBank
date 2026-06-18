package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.dto.ProdutoInvestimentoDTO;
import com.ifsp.ifBank.serverIfBank.service.ProdutoInvestimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos-investimento")
@RequiredArgsConstructor
public class ProdutoInvestimentoController {

    private final ProdutoInvestimentoService service;

    @PostMapping
    public ResponseEntity<ProdutoInvestimentoDTO> create(@RequestBody ProdutoInvestimentoDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProdutoInvestimentoDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<ProdutoInvestimentoDTO>> findAtivos() {
        return ResponseEntity.ok(service.findAtivos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoInvestimentoDTO> update(@PathVariable Integer id, @RequestBody ProdutoInvestimentoDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
