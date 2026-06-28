import { Injectable } from '@angular/core';

export interface DashboardDTO {
  saldo: number;
  totalInvestido: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/contas';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  async buscarDashboard(usuarioId: number): Promise<DashboardDTO> {
    const res = await fetch(`${this.apiUrl}/dashboard/${usuarioId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao buscar dashboard');
    return res.json();
  }
}
