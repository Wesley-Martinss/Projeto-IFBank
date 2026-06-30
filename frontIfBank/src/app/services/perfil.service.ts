// services/perfil.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface AtualizarPerfilDTO {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
}

export interface AtualizarPerfilResultado {
  sucesso: boolean;
  usuario?: any;
  erro?: string;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly baseUrl = 'http://localhost:8080/usuarios'; // ajuste para sua rota real

  constructor(private authService: AuthService) {}

  private get headers() {
    const token = this.authService.getToken?.() ?? '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async buscarPerfil(usuarioId: number) {
    const resp = await fetch(`${this.baseUrl}/${usuarioId}`, { headers: this.headers });
    if (!resp.ok) throw new Error('Falha ao buscar perfil');
    return resp.json();
  }

  async atualizarPerfil(
    usuarioId: number,
    dados: AtualizarPerfilDTO,
  ): Promise<AtualizarPerfilResultado> {
    try {
      const resp = await fetch(`${this.baseUrl}/${usuarioId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(dados),
      });
      if (!resp.ok) {
        const erro = await resp.text();
        return { sucesso: false, erro: erro || 'Erro ao atualizar perfil' };
      }
      return { sucesso: true, usuario: await resp.json() };
    } catch (e: any) {
      return { sucesso: false, erro: e?.message ?? 'Erro de conexão' };
    }
  }
}