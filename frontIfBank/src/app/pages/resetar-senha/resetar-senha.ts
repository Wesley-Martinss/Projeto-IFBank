import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-resetar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './resetar-senha.html',
  styleUrl: './resetar-senha.css'
})
export class ResetarSenhaComponent implements OnInit {
  token = '';
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  carregando = false;
  concluido = false;
  tokenInvalido = false;
  erro = '';
  mostrarSenha = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.tokenInvalido = true;
    }
  }

  async redefinir() {
    this.erro = '';

    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos';
      this.cdr.detectChanges();
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      this.cdr.detectChanges();
      return;
    }
    if (this.novaSenha.length < 6) {
      this.erro = 'A nova senha deve ter no mínimo 6 caracteres';
      this.cdr.detectChanges();
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const resultado = await this.authService.redefinirSenha(
      this.token,
      this.senhaAtual,
      this.novaSenha
    );

    if (resultado.sucesso) {
      this.concluido = true;
      setTimeout(() => this.router.navigate(['/login']), 2500);
    } else {
      this.erro = resultado.erro || 'Erro ao redefinir senha';
    }

    this.carregando = false;
    // fetch nativo roda fora da zona do Angular; força a atualização da tela
    this.cdr.detectChanges();
  }

  irParaEsqueci() {
    this.router.navigate(['/login']);
  }
}