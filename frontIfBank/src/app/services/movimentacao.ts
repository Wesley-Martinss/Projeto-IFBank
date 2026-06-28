import { Injectable } from '@angular/core';
import { MovimentacaoDTO } from '../models/movimentacao.model';

@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private api = 'http://localhost:8080/movimentacoes';

   private getToken() {
    return localStorage.getItem('token');
  }

    async validarDestinatario(chave: string): Promise<MovimentacaoDTO | null> {
      try {
        const res = await fetch(
          `${this.api}/validar-destinatario?chaveDestinatario=${chave}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.getToken()}`
            }
          }
        );

        return res.ok ? await res.json() : null;
      } catch {
        return null;
      }
  }


    async realizarMovimentacao(dto: MovimentacaoDTO): Promise<{ sucesso: boolean; erro?: string }> {
      try {
        const res = await fetch(this.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`
           },
          body: JSON.stringify(dto),
        });
        if (res.ok) {
          return { sucesso: true };
        }
        return { sucesso: false, erro: await res.text() };
      } catch (e: any) {
        return { sucesso: false, erro: e.message };
      }
    }
    }