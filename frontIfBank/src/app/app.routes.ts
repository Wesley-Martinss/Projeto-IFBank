import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { MovimentacoesComponent } from './pages/movimentacoes/movimentacoes';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { AdminComponent } from './pages/admin/admin';
import { ResetarSenhaComponent } from './pages/resetar-senha/resetar-senha';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'movimentacoes', component: MovimentacoesComponent },
  { path: 'cadastro', component: CadastroUsuario },
  { path: 'admin', component: AdminComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
];
