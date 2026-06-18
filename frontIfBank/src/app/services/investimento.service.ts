import { Injectable } from '@angular/core';

export interface InvestimentoDTO {
  id: number;
  produtoId: number;
  nomeProduto: string;
  valorInvestido: number;
  rendimentoAcumulado: number;
  taxaRendimentoMinuto: number;
  dataInicio: string;
  dataFim: string;
  resgatado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InvestimentoService {
  private apiUrl = 'http://localhost:8080/investimentos';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  async listarMeusInvestimentos(): Promise<InvestimentoDTO[]> {
    const res = await fetch(`${this.apiUrl}/meus-investimentos`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao buscar investimentos');
    return res.json();
  }

  async resgatar(id: number): Promise<InvestimentoDTO> {
    const res = await fetch(`${this.apiUrl}/${id}/resgatar`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao resgatar investimento');
    return res.json();
  }
}
