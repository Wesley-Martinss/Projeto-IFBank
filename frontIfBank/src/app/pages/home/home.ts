import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  pendentes: UsuarioDTO[] = [];
  carregando = false;
  mensagemSucesso = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Pega o usuário logado
    this.usuario = this.authService.getUsuarioLogado();
    console.log('1. Usuário Logado:', this.usuario);

    // Se não tiver usuário logado, joga de volta pro Login
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // Admin vai para o painel administrativo
    if (this.usuario.tipoUsuario === 'ADMIN') {
      this.router.navigate(['/admin']);
      return;
    }

    // 2. Se for Gerente, carrega as solicitações de contas pendentes
    if (this.usuario.tipoUsuario === 'GERENTE') {
      this.carregarPendentes();
    }
  }

  async carregarPendentes() {
    const listarPendentes = await this.authService.listarPendentes();
    this.pendentes = listarPendentes;
    this.cdr.detectChanges(); // Força a atualização da view
    console.log('2. Lista de Pendentes recebida:', this.pendentes);
  }

  async aprovar(clienteId: number) {
    if (!this.usuario) return;

    this.carregando = true;
    const resultado = await this.authService.aprovarConta(clienteId, this.usuario.id);

    this.ngZone.run(() => {
      if (resultado.sucesso) {
        this.mensagemSucesso = 'Conta aprovada e criada com sucesso!';
        // Remove o usuário aprovado da lista atual da tela
        this.pendentes = this.pendentes.filter((u) => u.id !== clienteId);
        this.cdr.detectChanges(); // Força a atualização da view

        // Remove a mensagem de sucesso depois de 3 segundos
        setTimeout(() => {
          this.mensagemSucesso = '';
          this.cdr.detectChanges();
        }, 3000);
      } else {
        alert('Falha ao aprovar a conta: ' + resultado.erro);
      }
    });
    this.carregando = false;
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirMovimentacao(tipo: string) {
    this.router.navigate(
      ['/movimentacoes'],
      {
        queryParams: { tipo }
      }
    );
  }
    
}
