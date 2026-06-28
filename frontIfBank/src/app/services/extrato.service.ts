import { Injectable } from '@angular/core';

export type TipoMovimentacaoExtrato = 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'INVESTIMENTO' | 'RENDIMENTO';

export interface MovimentacaoResumoDTO {
  tipoMovimentacao: TipoMovimentacaoExtrato;
  valor: number;
  descricao: string;
  dataMovimentacao: string;
}

@Injectable({ providedIn: 'root' })
export class ExtratoService {
  private api = 'http://localhost:8080/movimentacoes';

  private getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  async listarExtrato(): Promise<MovimentacaoResumoDTO[]> {
    const res = await fetch(`${this.api}/extrato`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Erro ao buscar extrato');
    return res.json();
  }
}
