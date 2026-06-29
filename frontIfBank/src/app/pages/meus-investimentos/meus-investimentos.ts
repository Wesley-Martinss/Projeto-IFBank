import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InvestimentoService, InvestimentoDTO } from '../../services/investimento.service';
import { IconComponent } from '../../shared/icon/icon';
import { TopbarComponent } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-meus-investimentos',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, TopbarComponent],
  templateUrl: './meus-investimentos.html',
  styleUrl: './meus-investimentos.css'
})
export class MeusInvestimentosComponent implements OnInit {
  investimentos: InvestimentoDTO[] = [];
  carregando = true;
  erro = '';
  mensagemSucesso = '';
  investimentoResgatando: number | null = null;

  constructor(
    private investimentoService: InvestimentoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarInvestimentos();
  }

  async carregarInvestimentos() {
    try {
      this.carregando = true;
      this.investimentos = await this.investimentoService.listarMeusInvestimentos();
    } catch (e) {
      this.erro = 'Erro ao carregar seus investimentos.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  async resgatar(inv: InvestimentoDTO) {
    if (this.investimentoResgatando) return;
    
    if (!confirm(`Deseja resgatar R$ ${(inv.valorInvestido + inv.rendimentoAcumulado).toFixed(2)} do seu investimento em ${inv.nomeProduto}?`)) {
      return;
    }

    try {
      this.investimentoResgatando = inv.id;
      this.erro = '';
      
      const resgatado = await this.investimentoService.resgatar(inv.id);
      this.mensagemSucesso = `Resgate de R$ ${(resgatado.valorInvestido + resgatado.rendimentoAcumulado).toFixed(2)} realizado com sucesso! O dinheiro já está na sua conta.`;
      
      // Remove o investimento da tela
      this.investimentos = this.investimentos.filter(i => i.id !== inv.id);
      
      setTimeout(() => {
        this.mensagemSucesso = '';
        this.cdr.markForCheck();
      }, 5000);

    } catch (e) {
      this.erro = 'Erro ao tentar resgatar o investimento. Tente novamente.';
    } finally {
      this.investimentoResgatando = null;
      this.cdr.markForCheck();
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  /** Percentual real de rendimento sobre o valor investido. */
  percentualRendimento(inv: InvestimentoDTO): number {
    if (!inv.valorInvestido) return 0;
    return (inv.rendimentoAcumulado / inv.valorInvestido) * 100;
  }

  totalDisponivel(inv: InvestimentoDTO): number {
    return inv.valorInvestido + inv.rendimentoAcumulado;
  }
}
