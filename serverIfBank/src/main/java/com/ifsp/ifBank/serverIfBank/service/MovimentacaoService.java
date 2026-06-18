package com.ifsp.ifBank.serverIfBank.service;


import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Investimento;
import com.ifsp.ifBank.serverIfBank.model.ProdutoInvestimento;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import com.ifsp.ifBank.serverIfBank.repository.ChaveTransferenciaRepository;
import com.ifsp.ifBank.serverIfBank.repository.InvestimentoRepository;
import com.ifsp.ifBank.serverIfBank.repository.MovimentacaoRepository;
import com.ifsp.ifBank.serverIfBank.repository.ProdutoInvestimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {
    private final ChaveTransferenciaRepository chaveTransferenciaRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final ContaService contaService;
    private final InvestimentoRepository investimentoRepository;
    private final ProdutoInvestimentoRepository produtoInvestimentoRepository;

    public MovimentacaoDTO procuraDestinatarioParaCriarNovaMovimentacao(String chaveDestinatario){

        ChavesTransferencia destinatario = chaveTransferenciaRepository.findByChave(chaveDestinatario).orElse(null);

        if(destinatario == null){
            return null;
        }

        Conta contaDestinatario = destinatario.getConta();
        MovimentacaoDTO movimentacaoDTO = new MovimentacaoDTO();

        if(contaDestinatario != null){
            movimentacaoDTO.setChaveDestinatario(chaveDestinatario);
            movimentacaoDTO.setIdContaDestinatario(contaDestinatario.getId());
            movimentacaoDTO.setNomeContaDestinatario(contaDestinatario.getUsuario().getNome());
        }

        return movimentacaoDTO;
    }


    @Transactional
    public MovimentacaoConta realizarMovimentacao(MovimentacaoDTO dto) {

        if(dto == null || dto.getTipoMovimentacao() == null){
            return null;
        }

        return switch (dto.getTipoMovimentacao()) {

            case TRANSFERENCIA -> realizarTransferencia(dto);

            case DEPOSITO -> realizarDeposito(dto);

            case SAQUE -> realizarSaque(dto);

            case INVESTIMENTO -> realizarInvestimento(dto);
            
            case RENDIMENTO -> throw new IllegalArgumentException("Movimentações de rendimento são geradas automaticamente e não por este método.");
        };
    }

    private MovimentacaoConta realizarTransferencia(MovimentacaoDTO dto){

        if(dto.getIdContaOrigem() == null ||
                dto.getIdContaDestinatario() == null){
            return null;
        }

        Conta contaOrigem =
                contaService.findById(dto.getIdContaOrigem());

        Conta contaDestino =
                contaService.findById(dto.getIdContaDestinatario());

        if(contaOrigem == null || contaDestino == null){
            return null;
        }

        if(!contaService.subNoSaldo(contaOrigem, dto.getValor())){
            return null;
        }

        if(!contaService.addNoSaldo(contaDestino, dto.getValor())){
            return null;
        }

        MovimentacaoConta movimentacao = new MovimentacaoConta();

        movimentacao.setContaOrigem(contaOrigem);
        movimentacao.setContaDestino(contaDestino);
        movimentacao.setTipoMovimentacao(TipoMovimentacao.TRANSFERENCIA);
        movimentacao.setValor(dto.getValor());
        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setDataMovimentacao(LocalDateTime.now());


        return movimentacaoRepository.save(movimentacao);
    }

    private MovimentacaoConta realizarDeposito(MovimentacaoDTO dto){

        Conta conta =
                contaService.findById(dto.getIdContaOrigem());

        if(conta == null){
            return null;
        }

        if(!contaService.addNoSaldo(conta, dto.getValor())){
            return null;
        }

        MovimentacaoConta movimentacao = new MovimentacaoConta();

        movimentacao.setContaOrigem(conta);
        movimentacao.setTipoMovimentacao(TipoMovimentacao.DEPOSITO);
        movimentacao.setValor(dto.getValor());
        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setDataMovimentacao(LocalDateTime.now());

        return movimentacaoRepository.save(movimentacao);
    }

    private MovimentacaoConta realizarSaque(MovimentacaoDTO dto){

        Conta conta =
                contaService.findById(dto.getIdContaOrigem());

        if(conta == null){
            return null;
        }

        if(!contaService.subNoSaldo(conta, dto.getValor())){
            return null;
        }

        MovimentacaoConta movimentacao = new MovimentacaoConta();

        movimentacao.setContaOrigem(conta);
        movimentacao.setTipoMovimentacao(TipoMovimentacao.SAQUE);
        movimentacao.setValor(dto.getValor());
        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setDataMovimentacao(LocalDateTime.now());

        return movimentacaoRepository.save(movimentacao);
    }

    private MovimentacaoConta realizarInvestimento(MovimentacaoDTO dto){

        Conta conta = contaService.findById(dto.getIdContaOrigem());
        if(conta == null){
            return null;
        }

        ProdutoInvestimento produto = produtoInvestimentoRepository.findById(dto.getIdProdutoInvestimento()).orElse(null);
        if(produto == null || !produto.getAtivo()){
            throw new RuntimeException("Produto de investimento inválido ou inativo.");
        }

        if(dto.getValor().compareTo(produto.getValorMinimo()) < 0){
            throw new RuntimeException("Valor menor que o mínimo permitido para este produto.");
        }

        if(!contaService.subNoSaldo(conta, dto.getValor())){
            throw new RuntimeException("Saldo insuficiente.");
        }

        Investimento investimento = new Investimento();
        investimento.setConta(conta);
        investimento.setProduto(produto);
        investimento.setValorInvestido(dto.getValor());
        investimento.setRendimento(BigDecimal.ZERO);
        investimento.setDataInicio(LocalDateTime.now());
        investimento.setDataFim(LocalDateTime.now().plusMinutes(produto.getPrazoMinutos()));
        investimento.setDataCadastro(LocalDateTime.now());
        investimentoRepository.save(investimento);

        MovimentacaoConta movimentacao = new MovimentacaoConta();
        movimentacao.setContaOrigem(conta);
        movimentacao.setTipoMovimentacao(TipoMovimentacao.INVESTIMENTO);
        movimentacao.setValor(dto.getValor());
        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setDataMovimentacao(LocalDateTime.now());

        return movimentacaoRepository.save(movimentacao);
    }
}
