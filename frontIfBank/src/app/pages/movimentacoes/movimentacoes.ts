import { Component, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovimentacaoService } from '../../services/movimentacao';
import { ProdutoInvestimentoService, ProdutoInvestimentoDTO } from '../../services/produto-investimento.service';
import { MovimentacaoDTO, TipoMovimentacao } from '../../models/movimentacao.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movimentacoes',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './movimentacoes.html',
  styleUrl: './movimentacoes.css',
  encapsulation: ViewEncapsulation.None
})
export class MovimentacoesComponent {

  etapa = 1;

  chaveDestinatario = '';
  dadosDestinatario: MovimentacaoDTO | null = null;

  idContaOrigem: number | null = null;
  valor: number | null = null;
  descricao = '';

  erro = '';
  sucesso = false;
  carregando = false;

  tipoMovimentacao: TipoMovimentacao | null = null;
  produtosAtivos: ProdutoInvestimentoDTO[] = [];
  produtoSelecionado: ProdutoInvestimentoDTO | null = null;
private getToken() {
  return localStorage.getItem('token');
}
  constructor(
    private movimentacaoService: MovimentacaoService,
    private produtoService: ProdutoInvestimentoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.tipoMovimentacao = params['tipo'] as TipoMovimentacao;
    if (this.tipoMovimentacao === 'INVESTIMENTO') {
      this.carregarProdutosInvestimento();
    }
  });

  this.carregarContaOrigem();
}

async carregarProdutosInvestimento() {
  try {
    this.produtosAtivos = await this.produtoService.findAtivos();
    this.cdr.markForCheck();
  } catch (e) {
    this.erro = 'Erro ao carregar opções de investimento.';
  }
}

selecionarProduto(produto: ProdutoInvestimentoDTO) {
  this.produtoSelecionado = produto;
  this.valor = produto.valorMinimo;
}

voltarProdutos() {
  this.produtoSelecionado = null;
  this.valor = null;
  this.erro = '';
}

private async carregarContaOrigem() {
  const usuario = this.authService.getUsuarioLogado();

  if (usuario?.id) {
    const res = await fetch(
      `http://localhost:8080/contas/por-usuario/${usuario.id}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    );

    if (res.ok) {
      const conta = await res.json();
      this.idContaOrigem = conta.id;
      this.cdr.markForCheck();
    }
  }
}

  async validarDestinatario() {
    if (this.carregando) return;
    this.carregando = true;
    this.erro = '';

    const res = await this.movimentacaoService.validarDestinatario(this.chaveDestinatario);

    if (res?.idContaDestinatario) {
      this.dadosDestinatario = res;
      this.etapa = 2;
    } else {
      this.erro = 'Destinatário não encontrado.';
    }

    this.carregando = false;
    this.cdr.markForCheck();
  }

  async realizarMovimentacao() {
    if (this.carregando) return;
    this.carregando = true;
    this.erro = '';

    try {
      const dto: MovimentacaoDTO = {
        idContaOrigem: this.idContaOrigem!,
        valor: this.valor!,
        descricao: this.descricao,
        tipoMovimentacao: this.tipoMovimentacao!
      };

      if (this.tipoMovimentacao === 'TRANSFERENCIA') {
        dto.chaveDestinatario = this.chaveDestinatario;
        dto.idContaDestinatario = this.dadosDestinatario?.idContaDestinatario;
        dto.nomeContaDestinatario = this.dadosDestinatario?.nomeContaDestinatario;
      } else if (this.tipoMovimentacao === 'INVESTIMENTO') {
        dto.idProdutoInvestimento = this.produtoSelecionado?.id;
      }

      const resultado = await this.movimentacaoService.realizarMovimentacao(dto);

      if (resultado.sucesso) {
        this.sucesso = true;
      } else {
        this.erro = resultado.erro || 'Erro ao realizar movimentação.';
      }

    } catch {
      this.erro = 'Erro ao realizar movimentação.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  getTitulo() {
    switch (this.tipoMovimentacao) {
      case 'DEPOSITO':     return 'Depósito';
      case 'SAQUE':        return 'Saque';
      case 'TRANSFERENCIA': return 'Transferência';
      case 'INVESTIMENTO': return 'Investimento';
      default:             return 'Movimentação';
    }
  }

  getBtnLabel(): string {
    switch (this.tipoMovimentacao) {
      case 'DEPOSITO':     return 'Depositar';
      case 'SAQUE':        return 'Sacar';
      case 'INVESTIMENTO': return 'Investir agora';
      default:             return 'Confirmar';
    }
  }

  getIconStyle(): { [key: string]: string } {
    const map: Record<string, { bg: string; color: string }> = {
      DEPOSITO:      { bg: '#EAF3DE', color: '#3B6D11' },
      SAQUE:         { bg: '#FAECE7', color: '#993C1D' },
      TRANSFERENCIA: { bg: '#EEEDFE', color: '#534AB7' },
      INVESTIMENTO:  { bg: '#FAEEDA', color: '#854F0B' },
    };
    const s = map[this.tipoMovimentacao ?? ''] ?? { bg: '#EEEDFE', color: '#534AB7' };
    return { background: s.bg, color: s.color };
  }
}