import { Injectable } from '@angular/core';
import { MovimentacaoDTO } from '../models/movimentacao.model';

@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private api = 'http://localhost:8080/movimentacoes';
    async validarDestinatario(chave: string): Promise<MovimentacaoDTO | null> {
      try {
        const res = await fetch(
          `${this.api}/validar-destinatario?chaveDestinatario=${chave}`,
          { method: 'POST' }
        );
        return res.ok ? res.json() : null;
      } catch {
        return null;
      }
    }

    async realizarMovimentacao(dto: MovimentacaoDTO): Promise<boolean> {
      try {
        const res = await fetch(this.api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });
        return res.ok;
      } catch {
        return false;
      }
    }
    }