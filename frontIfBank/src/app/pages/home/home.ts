import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardDTO } from '../../services/dashboard.service';
import { ExtratoService, MovimentacaoResumoDTO } from '../../services/extrato.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { IconComponent, IconName } from '../../shared/icon/icon';
import { TopbarComponent } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent, TopbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  usuario: UsuarioDTO | null = null;
  pendentes: UsuarioDTO[] = [];
  carregando = false;
  mensagemSucesso = '';
  foto: string = '';
  dashboard: DashboardDTO | null = null;
  carregandoDashboard = false;
  extrato: MovimentacaoResumoDTO[] = [];
  carregandoExtrato = false;
  @ViewChild('fotoInput') fotoInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private extratoService: ExtratoService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

 async ngOnInit() {
  // Usuário obtido pelo token (apenas para pegar o ID e o tipo)
  const usuarioToken = this.authService.getUsuarioLogado();

  if (!usuarioToken) {
    this.router.navigate(['/login']);
    return;
  }

  // Busca os dados atualizados no banco
  const usuarioBanco = await this.authService.buscarUsuario(usuarioToken.id);

  if (!usuarioBanco) {
    this.router.navigate(['/login']);
    return;
  }

  this.usuario = usuarioBanco;

  // Foto do banco (caso não exista, usa a salva localmente)
  this.foto = usuarioBanco.foto || this.authService.getFoto() || '';

  // Admin vai para o painel administrativo
  if (this.usuario.tipoUsuario === 'ADMIN') {
    this.router.navigate(['/admin']);
    return;
  }

  // Se for gerente, carrega as contas pendentes
  if (this.usuario.tipoUsuario === 'GERENTE') {
    await this.carregarPendentes();
  }

  // Se for cliente, carrega dashboard e extrato
  if (this.usuario.tipoUsuario === 'CLIENTE') {
    await Promise.all([
      this.carregarDashboard(),
      this.carregarExtrato()
    ]);
  }
}

  async carregarDashboard() {
    if (!this.usuario) return;
    try {
      this.carregandoDashboard = true;
      this.dashboard = await this.dashboardService.buscarDashboard(this.usuario.id);
    } catch (e) {
      // Falha silenciosa: dashboard é informativo, não bloqueia o uso da tela
      this.dashboard = null;
    } finally {
      this.carregandoDashboard = false;
      this.cdr.markForCheck();
    }
  }

  async carregarExtrato() {
    try {
      this.carregandoExtrato = true;
      this.extrato = (await this.extratoService.listarExtrato()).slice(0, 5);
    } catch (e) {
      this.extrato = [];
    } finally {
      this.carregandoExtrato = false;
      this.cdr.markForCheck();
    }
  }

  triggerFotoInput() {
    this.fotoInput.nativeElement.click();
  }
  abrirPerfil() {
    this.router.navigate(['/meu-perfil']);
  }
  async onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.usuario) return;

    const resultado = await this.authService.uploadFoto(this.usuario.id, input.files[0]);

    if (resultado.sucesso && resultado.foto) {
      this.foto = resultado.foto;

      // Persiste a foto (best-effort; imagens grandes podem estourar a cota)
      this.authService.salvarFoto(resultado.foto);
      this.usuario = { ...this.usuario, foto: resultado.foto };
      this.cdr.detectChanges();
    } else {
      alert('Erro ao enviar a foto: ' + resultado.erro);
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

  alterarSenha() {
    // O e-mail vem como "sub" no token JWT (não há campo "email" decodificado)
    const email: string = this.usuario?.email || (this.usuario as any)?.sub || '';
    if (!email) return;

    this.authService.esqueceuSenha(email).then((resultado) => {
      if (resultado.sucesso) {
        alert('E-mail enviado para ' + email + '!\nVerifique sua caixa de entrada.');
      } else {
        alert('Erro ao enviar e-mail: ' + resultado.erro);
      }
    });
  }

  abrirMovimentacao(tipo: string) {
    this.router.navigate(['/movimentacoes'], {
      queryParams: { tipo },
    });
  }

  abrirMeusInvestimentos() {
    this.router.navigate(['/meus-investimentos']);
  }

  abrirMinhasChaves() {
    this.router.navigate(['/minhas-chaves']);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  valorAbsoluto(valor: number): number {
    return Math.abs(valor);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  rotuloMovimentacao(tipo: string): string {
    const rotulos: Record<string, string> = {
      DEPOSITO: 'Depósito',
      SAQUE: 'Saque',
      TRANSFERENCIA: 'Transferência',
      INVESTIMENTO: 'Investimento',
      RENDIMENTO: 'Resgate de investimento',
    };
    return rotulos[tipo] ?? tipo;
  }

  iconeMovimentacao(tipo: string): IconName {
    const icones: Record<string, IconName> = {
      DEPOSITO: 'deposit',
      SAQUE: 'withdraw',
      TRANSFERENCIA: 'transfer',
      INVESTIMENTO: 'invest',
      RENDIMENTO: 'chart',
    };
    return icones[tipo] ?? 'transfer';
  }
}
