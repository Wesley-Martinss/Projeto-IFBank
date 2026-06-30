// pages/landing/landing.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Lancamento {
  label: string;
  valor: string;
  positivo: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  lancamentos: Lancamento[] = [
    { label: 'PIX recebido · Maria S.', valor: '+ R$ 350,00', positivo: true },
    { label: 'Rendimento CDB', valor: '+ R$ 12,40', positivo: true },
    { label: 'Supermercado Bom Preço', valor: '− R$ 87,30', positivo: false },
    { label: 'PIX enviado · Aluguel', valor: '− R$ 900,00', positivo: false },
    { label: 'Investimento Tesouro', valor: '+ R$ 5,82', positivo: true },
  ];

  recursos = [
    {
      titulo: 'PIX na hora',
      texto: 'Transferências instantâneas, sem taxa, a qualquer hora do dia.',
      icone: '⚡',
    },
    {
      titulo: 'Seu dinheiro rendendo',
      texto: 'Investimentos simples, com liquidez diária e resgate quando quiser.',
      icone: '◆',
    },
    {
      titulo: 'Tudo em um lugar',
      texto: 'Conta, cartão, extrato e investimentos numa única tela, sem complicação.',
      icone: '◧',
    },
    {
      titulo: 'Sem letras miúdas',
      texto: 'Sem manutenção de conta, sem pegadinha, sem surpresa na fatura.',
      icone: '○',
    },
  ];

  constructor(private router: Router) {}

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}