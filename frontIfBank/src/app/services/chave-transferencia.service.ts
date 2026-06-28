import { Injectable } from '@angular/core';

export interface ChaveTransferenciaDTO {
  id: number;
  chave: string;
  ativo: boolean;
}

export type TipoChave = 'EMAIL' | 'CPF' | 'TELEFONE' | 'ALEATORIA';

@Injectable({ providedIn: 'root' })
export class ChaveTransferenciaService {
  private api = 'http://localhost:8080/chaves-transferencia';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  async listarMinhasChaves(): Promise<ChaveTransferenciaDTO[]> {
    const res = await fetch(this.api, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Erro ao buscar chaves de transferência');
    return res.json();
  }

  async criarChave(tipo: TipoChave, valor?: string): Promise<{ sucesso: boolean; chave?: ChaveTransferenciaDTO; erro?: string }> {
    try {
      const res = await fetch(this.api, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ tipo, valor }),
      });
      if (res.ok) {
        return { sucesso: true, chave: await res.json() };
      }
      return { sucesso: false, erro: await res.text() };
    } catch (e: any) {
      return { sucesso: false, erro: e.message };
    }
  }

  async desativarChave(id: number): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`${this.api}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (res.ok) return { sucesso: true };
      return { sucesso: false, erro: await res.text() };
    } catch (e: any) {
      return { sucesso: false, erro: e.message };
    }
  }
}
