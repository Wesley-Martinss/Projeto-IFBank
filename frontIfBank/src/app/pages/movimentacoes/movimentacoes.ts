import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovimentacaoService } from '../../services/movimentacao';
import { MovimentacaoDTO } from '../../models/movimentacao.model';

@Component({
  selector: 'app-movimentacoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movimentacoes.html',
})
export class MovimentacoesComponent {
  etapa: number = 1;
  chaveDestinatario = '';
  dadosDestinatario: MovimentacaoDTO | null = null;
  idContaOrigem: number | null = null;
  valor: number | null = null;
  descricao = '';
  erro = '';
  sucesso = false;
  carregando = false;

  constructor(
    private movimentacaoService: MovimentacaoService,
    private zone: NgZone
  ) {}

  async validarDestinatario() {
    if (this.carregando) return;
    this.carregando = true;
    this.erro = '';
    const res = await this.movimentacaoService.validarDestinatarioDebug(this.chaveDestinatario);
    this.zone.run(() => {
      if (res?.idContaDestinatario) {
        this.dadosDestinatario = res;
        this.etapa = 2;
      } else {
        this.erro = 'Destinatário não encontrado.';
      }
      this.carregando = false;
    });
  }

  async realizarTransferencia() {
    if (this.carregando) return;
    this.carregando = true;
    this.erro = '';
    const dto: MovimentacaoDTO = {
      chaveDestinatario: this.chaveDestinatario,
      idContaDestinatario: this.dadosDestinatario?.idContaDestinatario,
      nomeContaDestinatario: this.dadosDestinatario?.nomeContaDestinatario,
      idContaOrigem: this.idContaOrigem!,
      valor: this.valor!,
      descricao: this.descricao,
      tipoMovimentacao: 'TRANSFERENCIA',
    };
    await this.movimentacaoService.realizarMovimentacaoDebug(dto);
    this.zone.run(() => {
      this.sucesso = true;
      this.carregando = false;
    });
  }
}