import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
})
export class LoginComponent {
  constructor(private router: Router) {}

  entrar() {
    this.router.navigate(['/home']);
  }
}