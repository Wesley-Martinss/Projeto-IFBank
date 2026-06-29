import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent], // Adicionado FormsModule para usar [(ngModel)]
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;
  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async entrar() {
    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      this.cdr.detectChanges();
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.cdr.detectChanges();

    const usuario = await this.authService.login(this.email, this.senha);

    if (usuario) {
      this.router.navigate(['/home']);
    } else {
      this.erro = 'E-mail ou senha inválidos.';
    }
    this.carregando = false;
    // fetch nativo roda fora da zona do Angular; força a atualização da tela
    this.cdr.detectChanges();
  }
}
