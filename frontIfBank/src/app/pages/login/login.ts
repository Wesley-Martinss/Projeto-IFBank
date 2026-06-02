import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], // Adicionado FormsModule para usar [(ngModel)]
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async entrar() {
    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    const usuario = await this.authService.login(this.email, this.senha);

    if (usuario) {
      this.router.navigate(['/home']);
    } else {
      this.erro = 'E-mail ou senha inválidos.';
    }
    this.carregando = false;
  }
}
