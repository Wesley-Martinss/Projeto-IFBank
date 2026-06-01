import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  pendentes: UsuarioDTO[] = [];
  carregando = false;
  mensagemSucesso = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    // 1. Pega o usuário logado
    this.usuario = this.authService.getUsuarioLogado();

    // Se não tiver usuário logado, joga de volta pro Login
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Se for Gerente, carrega as solicitações de contas pendentes
    if (this.usuario.tipoUsuario === 'GERENTE') {
      this.carregarPendentes();
    }
  }

  async carregarPendentes() {
    this.pendentes = await this.authService.listarPendentes();
  }

  async aprovar(clienteId: number) {
    if (!this.usuario) return;

    this.carregando = true;
    const sucesso = await this.authService.aprovarConta(clienteId, this.usuario.id);

    if (sucesso) {
      this.mensagemSucesso = 'Conta aprovada e criada com sucesso!';
      // Remove o usuário aprovado da lista atual da tela
      this.pendentes = this.pendentes.filter((u) => u.id !== clienteId);

      // Remove a mensagem de sucesso depois de 3 segundos
      setTimeout(() => (this.mensagemSucesso = ''), 3000);
    } else {
      alert('Falha ao aprovar a conta.');
    }
    this.carregando = false;
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
