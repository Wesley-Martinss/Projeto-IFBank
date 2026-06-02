package com.ifsp.ifBank.serverIfBank.service;


import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import com.ifsp.ifBank.serverIfBank.repository.ChaveTransferenciaRepository;
import com.ifsp.ifBank.serverIfBank.repository.MovimentacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {
    private final ChaveTransferenciaRepository chaveTransferenciaRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final ContaService contaService;

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
        throw new UnsupportedOperationException(
                "Investimentos ainda não funciona");
    }
}
