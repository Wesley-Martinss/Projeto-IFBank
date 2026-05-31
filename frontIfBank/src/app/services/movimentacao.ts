import { Injectable } from '@angular/core';
import { MovimentacaoDTO } from '../models/movimentacao.model';

@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private api = 'http://localhost:8080/movimentacoes';

  async validarDestinatarioDebug(chave: string): Promise<any> {
    const url = `${this.api}/validar-destinatario?chaveDestinatario=${chave}`;
    console.log('Chamando:', url);
    const res = await fetch(url, { method: 'POST' });
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Body:', body);
    return body;
  }

  async realizarMovimentacaoDebug(dto: MovimentacaoDTO): Promise<any> {
    const res = await fetch(this.api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    const body = await res.json();
    console.log('Movimentacao status:', res.status, 'body:', body);
    return body;
  }
}