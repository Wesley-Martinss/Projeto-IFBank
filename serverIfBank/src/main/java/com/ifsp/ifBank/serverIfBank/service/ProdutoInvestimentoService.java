package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.ProdutoInvestimento;
import com.ifsp.ifBank.serverIfBank.model.dto.ProdutoInvestimentoDTO;
import com.ifsp.ifBank.serverIfBank.repository.ProdutoInvestimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoInvestimentoService {

    private final ProdutoInvestimentoRepository repository;

    public ProdutoInvestimentoDTO create(ProdutoInvestimentoDTO dto) {
        ProdutoInvestimento produto = new ProdutoInvestimento();
        mapToEntity(dto, produto);
        ProdutoInvestimento saved = repository.save(produto);
        return mapToDTO(saved);
    }

    public List<ProdutoInvestimentoDTO> findAll() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProdutoInvestimentoDTO> findAtivos() {
        return repository.findByAtivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProdutoInvestimentoDTO update(Integer id, ProdutoInvestimentoDTO dto) {
        ProdutoInvestimento produto = repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        mapToEntity(dto, produto);
        ProdutoInvestimento updated = repository.save(produto);
        return mapToDTO(updated);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    private void mapToEntity(ProdutoInvestimentoDTO dto, ProdutoInvestimento entity) {
        entity.setNome(dto.getNome());
        entity.setTipoInvestimento(dto.getTipoInvestimento());
        entity.setTaxaRendimentoMinuto(dto.getTaxaRendimentoMinuto());
        entity.setPrazoMinutos(dto.getPrazoMinutos());
        entity.setValorMinimo(dto.getValorMinimo());
        entity.setAtivo(dto.getAtivo());
    }

    private ProdutoInvestimentoDTO mapToDTO(ProdutoInvestimento entity) {
        ProdutoInvestimentoDTO dto = new ProdutoInvestimentoDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setTipoInvestimento(entity.getTipoInvestimento());
        dto.setTaxaRendimentoMinuto(entity.getTaxaRendimentoMinuto());
        dto.setPrazoMinutos(entity.getPrazoMinutos());
        dto.setValorMinimo(entity.getValorMinimo());
        dto.setAtivo(entity.getAtivo());
        return dto;
    }
}
