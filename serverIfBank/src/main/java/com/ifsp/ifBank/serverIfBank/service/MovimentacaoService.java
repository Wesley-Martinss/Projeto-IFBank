package com.ifsp.ifBank.serverIfBank.service;


import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.Conta;
import com.ifsp.ifBank.serverIfBank.model.Investimento;
import com.ifsp.ifBank.serverIfBank.model.ProdutoInvestimento;
import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoDTO;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoResumoDTO;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoMovimentacao;
import com.ifsp.ifBank.serverIfBank.repository.ChaveTransferenciaRepository;
import com.ifsp.ifBank.serverIfBank.repository.ContaRepository;
import com.ifsp.ifBank.serverIfBank.repository.InvestimentoRepository;
import com.ifsp.ifBank.serverIfBank.repository.MovimentacaoRepository;
import com.ifsp.ifBank.serverIfBank.repository.ProdutoInvestimentoRepository;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {
    private final ChaveTransferenciaRepository chaveTransferenciaRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final ContaService contaService;
    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;
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

    public List<MovimentacaoResumoDTO> listarMinhasMovimentacoes(String emailUsuario) {
        Conta conta = getContaByEmail(emailUsuario);

        return movimentacaoRepository.findByContaOrigemIdOrContaDestinoIdOrderByDataMovimentacaoDesc(conta.getId(), conta.getId())
                .stream()
                .map(m -> toResumoDTO(m, conta.getId()))
                .toList();
    }

    private MovimentacaoResumoDTO toResumoDTO(MovimentacaoConta m, Integer contaId) {
        MovimentacaoResumoDTO dto = new MovimentacaoResumoDTO();
        dto.setTipoMovimentacao(m.getTipoMovimentacao());
        dto.setDescricao(m.getDescricao());
        dto.setDataMovimentacao(m.getDataMovimentacao());

        // Se for uma transferência recebida (conta logada é o destino), o valor é positivo (entrada).
        // Se for uma transferência enviada/saque/investimento, valor é negativo (saída) na ótica da conta.
        boolean ehEntradaNaConta = m.getContaDestino() != null && m.getContaDestino().getId().equals(contaId);
        boolean ehTransferenciaEnviada = m.getTipoMovimentacao() == TipoMovimentacao.TRANSFERENCIA
                && m.getContaOrigem() != null && m.getContaOrigem().getId().equals(contaId);

        if (ehEntradaNaConta || m.getTipoMovimentacao() == TipoMovimentacao.DEPOSITO
                || m.getTipoMovimentacao() == TipoMovimentacao.RENDIMENTO) {
            dto.setValor(m.getValor());
        } else if (ehTransferenciaEnviada || m.getTipoMovimentacao() == TipoMovimentacao.SAQUE
                || m.getTipoMovimentacao() == TipoMovimentacao.INVESTIMENTO) {
            dto.setValor(m.getValor().negate());
        } else {
            dto.setValor(m.getValor());
        }

        return dto;
    }

    private Conta getContaByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return contaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada."));
    }


    @Transactional
    public MovimentacaoConta realizarMovimentacao(MovimentacaoDTO dto, String emailUsuarioAutenticado) {

        if(dto == null || dto.getTipoMovimentacao() == null){
            return null;
        }

        // Garante que a conta de origem informada realmente pertence ao usuário autenticado.
        Conta contaDoUsuario = getContaByEmail(emailUsuarioAutenticado);
        if(dto.getIdContaOrigem() == null || !dto.getIdContaOrigem().equals(contaDoUsuario.getId())){
            throw new RuntimeException("A conta de origem informada não pertence ao usuário autenticado.");
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
            throw new RuntimeException("Dados da transferência incompletos.");
        }

        Conta contaOrigem =
                contaService.findById(dto.getIdContaOrigem());

        Conta contaDestino =
                contaService.findById(dto.getIdContaDestinatario());

        if(contaOrigem == null || contaDestino == null){
            throw new RuntimeException("Conta de origem ou destino não encontrada.");
        }

        if(contaOrigem.getId().equals(contaDestino.getId())){
            throw new RuntimeException("Não é possível transferir para a própria conta.");
        }

        if(!contaService.subNoSaldo(contaOrigem, dto.getValor())){
            throw new RuntimeException("Saldo insuficiente para realizar a transferência.");
        }

        if(!contaService.addNoSaldo(contaDestino, dto.getValor())){
            // Reverte o débito já realizado, já que o crédito ao destino falhou.
            contaService.addNoSaldo(contaOrigem, dto.getValor());
            throw new RuntimeException("Não foi possível creditar o valor na conta de destino.");
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
            throw new RuntimeException("Conta não encontrada.");
        }

        if(!contaService.addNoSaldo(conta, dto.getValor())){
            throw new RuntimeException("Informe um valor de depósito válido.");
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
            throw new RuntimeException("Conta não encontrada.");
        }

        if(!contaService.subNoSaldo(conta, dto.getValor())){
            throw new RuntimeException("Saldo insuficiente para realizar o saque.");
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
