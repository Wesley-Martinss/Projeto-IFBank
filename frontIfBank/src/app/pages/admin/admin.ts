import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, ContaAdmin, MovimentacaoAdmin } from '../../services/admin.service';
import { AdminInvestimentosComponent } from '../admin-investimentos/admin-investimentos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminInvestimentosComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  abaAtiva: 'contas' | 'transacoes' | 'gerentes' | 'investimentos' = 'contas';

  contas: ContaAdmin[] = [];
  movimentacoes: MovimentacaoAdmin[] = [];

  carregandoContas = false;
  carregandoMovimentacoes = false;

  novoGerente = { nome: '', email: '', cpf: '', senha: '' };
  criandoGerente = false;
  mensagemGerente = '';
  erroGerente = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuarioLogado();
    if (!usuario || usuario.tipoUsuario !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarContas();
  }

  mudarAba(aba: 'contas' | 'transacoes' | 'gerentes' | 'investimentos') {
    this.abaAtiva = aba;
    if (aba === 'contas' && this.contas.length === 0) this.carregarContas();
    if (aba === 'transacoes' && this.movimentacoes.length === 0) this.carregarMovimentacoes();
  }

  async carregarContas() {
    this.carregandoContas = true;
    this.contas = await this.adminService.listarContas();
    this.carregandoContas = false;
    this.cdr.detectChanges();
  }

  async carregarMovimentacoes() {
    this.carregandoMovimentacoes = true;
    this.movimentacoes = await this.adminService.listarMovimentacoes();
    this.carregandoMovimentacoes = false;
    this.cdr.detectChanges();
  }

  async submeterGerente() {
    this.mensagemGerente = '';
    this.erroGerente = '';

    if (!this.novoGerente.nome || !this.novoGerente.email || !this.novoGerente.cpf || !this.novoGerente.senha) {
      this.erroGerente = 'Preencha todos os campos.';
      return;
    }

    this.criandoGerente = true;
    const resultado = await this.adminService.criarGerente(this.novoGerente);
    this.criandoGerente = false;

    if (resultado.sucesso) {
      this.mensagemGerente = 'Gerente criado com sucesso!';
      this.novoGerente = { nome: '', email: '', cpf: '', senha: '' };
    } else {
      this.erroGerente = resultado.erro ?? 'Erro ao criar gerente.';
    }
    this.cdr.detectChanges();
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
