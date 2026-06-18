import { Injectable } from '@angular/core';

export interface ProdutoInvestimentoDTO {
  id?: number;
  nome: string;
  tipoInvestimento: string;
  taxaRendimentoMinuto: number;
  prazoMinutos: number;
  valorMinimo: number;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoInvestimentoService {

  private apiUrl = 'http://localhost:8080/produtos-investimento';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  async findAll(): Promise<ProdutoInvestimentoDTO[]> {
    const res = await fetch(this.apiUrl, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    return res.json();
  }

  async findAtivos(): Promise<ProdutoInvestimentoDTO[]> {
    const res = await fetch(`${this.apiUrl}/ativos`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Erro ao buscar produtos ativos');
    return res.json();
  }

  async create(produto: ProdutoInvestimentoDTO): Promise<ProdutoInvestimentoDTO> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(produto)
    });
    if (!res.ok) throw new Error('Erro ao criar produto');
    return res.json();
  }

  async update(id: number, produto: ProdutoInvestimentoDTO): Promise<ProdutoInvestimentoDTO> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(produto)
    });
    if (!res.ok) throw new Error('Erro ao atualizar produto');
    return res.json();
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Erro ao deletar produto');
  }
}
