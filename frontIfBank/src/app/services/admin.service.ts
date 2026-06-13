import { Injectable } from '@angular/core';

export interface ContaAdmin {
  id: number;
  nomeTitular: string;
  emailTitular: string;
  numeroConta: string;
  agencia: string;
  saldo: number;
  ativa: boolean;
  tipoUsuario: string;
  statusConta: string;
}

export interface MovimentacaoAdmin {
  id: number;
  dataMovimentacao: string;
  tipoMovimentacao: string;
  valor: number;
  descricao: string;
  numeroContaOrigem: string;
  nomeTitularOrigem: string;
  numeroContaDestino: string | null;
  nomeTitularDestino: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = 'http://localhost:8080/admin';

  private getToken() {
    return localStorage.getItem('token');
  }

  async listarContas(): Promise<ContaAdmin[]> {
    try {
      const res = await fetch(`${this.api}/contas`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }

  async listarMovimentacoes(): Promise<MovimentacaoAdmin[]> {
    try {
      const res = await fetch(`${this.api}/movimentacoes`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  }

  async criarGerente(dados: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
  }): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`${this.api}/gerentes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(dados),
      });
      if (res.ok) return { sucesso: true };
      return { sucesso: false, erro: await res.text() };
    } catch (e: any) {
      return { sucesso: false, erro: e.message };
    }
  }
}
