import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { MovimentacoesComponent } from './pages/movimentacoes/movimentacoes';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { AdminComponent } from './pages/admin/admin';
import { AdminInvestimentosComponent } from './pages/admin-investimentos/admin-investimentos';
import { ResetarSenhaComponent } from './pages/resetar-senha/resetar-senha';
import { MeusInvestimentosComponent } from './pages/meus-investimentos/meus-investimentos';
import { MinhasChavesComponent } from './pages/minhas-chaves/minhas-chaves';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'movimentacoes', component: MovimentacoesComponent },
  { path: 'cadastro', component: CadastroUsuario },
  { path: 'admin', component: AdminComponent },
  { path: 'admin-investimentos', component: AdminInvestimentosComponent },
  { path: 'resetar-senha', component: ResetarSenhaComponent },
  { path: 'meus-investimentos', component: MeusInvestimentosComponent },
  { path: 'minhas-chaves', component: MinhasChavesComponent },
];
