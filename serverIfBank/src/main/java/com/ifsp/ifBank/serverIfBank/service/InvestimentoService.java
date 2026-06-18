package com.ifsp.ifBank.serverIfBank.service;

import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Investimento;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.InvestimentoDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import com.ifsp.ifBank.serverIfBank.repository.InvestimentoRepository;
import com.ifsp.ifBank.serverIfBank.repository.MovimentacaoRepository;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestimentoService {

    private final InvestimentoRepository investimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final MovimentacaoRepository movimentacaoRepository;

    public List<InvestimentoDTO> listarMeusInvestimentos(String emailUsuario) {
        Conta conta = getContaByEmail(emailUsuario);
        List<Investimento> investimentos = investimentoRepository.findByContaId(conta.getId());

        return investimentos.stream()
                .filter(inv -> inv.getResgatado() == null || !inv.getResgatado())
                .map(this::toDTOComRendimentoAtualizado)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvestimentoDTO resgatar(Integer investimentoId, String emailUsuario) {
        Conta conta = getContaByEmail(emailUsuario);
        Investimento inv = investimentoRepository.findById(investimentoId)
                .orElseThrow(() -> new RuntimeException("Investimento não encontrado."));

        if (!inv.getConta().getId().equals(conta.getId())) {
            throw new RuntimeException("Investimento não pertence a esta conta.");
        }

        if (inv.getResgatado() != null && inv.getResgatado()) {
            throw new RuntimeException("Investimento já foi resgatado.");
        }

        InvestimentoDTO dto = toDTOComRendimentoAtualizado(inv);
        BigDecimal valorTotalResgate = dto.getValorInvestido().add(dto.getRendimentoAcumulado());

        // Atualizar saldo
        conta.setSaldo(conta.getSaldo().add(valorTotalResgate));
        contaRepository.save(conta);

        // Atualizar Investimento
        inv.setResgatado(true);
        inv.setRendimento(dto.getRendimentoAcumulado());
        inv.setDataFim(LocalDateTime.now());
        investimentoRepository.save(inv);

        // Gerar Movimentacao
        MovimentacaoConta mov = new MovimentacaoConta();
        mov.setContaOrigem(conta);
        mov.setTipoMovimentacao(TipoMovimentacao.RENDIMENTO);
        mov.setValor(valorTotalResgate);
        mov.setDescricao("Resgate de Investimento - " + inv.getProduto().getNome());
        mov.setDataMovimentacao(LocalDateTime.now());
        movimentacaoRepository.save(mov);

        return dto;
    }

    private Conta getContaByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return contaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada."));
    }

    private InvestimentoDTO toDTOComRendimentoAtualizado(Investimento inv) {
        InvestimentoDTO dto = new InvestimentoDTO();
        dto.setId(inv.getId());
        
        if (inv.getProduto() != null) {
            dto.setProdutoId(inv.getProduto().getId());
            dto.setNomeProduto(inv.getProduto().getNome());
            dto.setTaxaRendimentoMinuto(inv.getProduto().getTaxaRendimentoMinuto());
        }

        dto.setValorInvestido(inv.getValorInvestido() != null ? inv.getValorInvestido() : BigDecimal.ZERO);
        dto.setDataInicio(inv.getDataInicio());
        dto.setDataFim(inv.getDataFim());
        dto.setResgatado(inv.getResgatado());

        LocalDateTime inicio = inv.getDataInicio() != null ? inv.getDataInicio() : (inv.getDataCadastro() != null ? inv.getDataCadastro() : LocalDateTime.now());
        long minutosPassados = Duration.between(inicio, LocalDateTime.now()).toMinutes();
        if (minutosPassados < 0) minutosPassados = 0;

        BigDecimal taxaBruta = dto.getTaxaRendimentoMinuto() != null ? dto.getTaxaRendimentoMinuto() : BigDecimal.ZERO;
        BigDecimal taxaPercentual = taxaBruta.divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP);
        
        BigDecimal valorInvestido = inv.getValorInvestido() != null ? inv.getValorInvestido() : BigDecimal.ZERO;

        BigDecimal rendimento = valorInvestido
                .multiply(taxaPercentual)
                .multiply(new BigDecimal(minutosPassados))
                .setScale(2, RoundingMode.HALF_UP);

        dto.setRendimentoAcumulado(rendimento);
        return dto;
    }
}
