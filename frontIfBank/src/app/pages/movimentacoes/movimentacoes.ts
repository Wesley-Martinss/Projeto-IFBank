import { Component, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovimentacaoService } from '../../services/movimentacao';
import { MovimentacaoDTO, TipoMovimentacao } from '../../models/movimentacao.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(
    private movimentacaoService: MovimentacaoService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.tipoMovimentacao = params['tipo'] as TipoMovimentacao;
  });

  this.carregarContaOrigem();
}

private async carregarContaOrigem() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  console.log('usuario do localStorage:', usuario);

  if (usuario?.id) {
    const res = await fetch(`http://localhost:8080/contas/por-usuario/${usuario.id}`);
    console.log('status da conta:', res.status);
    if (res.ok) {
      const conta = await res.json();
      console.log('conta:', conta);
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
      }

      await this.movimentacaoService.realizarMovimentacao(dto);
      this.sucesso = true;

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