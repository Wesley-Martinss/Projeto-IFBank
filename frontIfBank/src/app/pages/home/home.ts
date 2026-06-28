import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardDTO } from '../../services/dashboard.service';
import { ExtratoService, MovimentacaoResumoDTO } from '../../services/extrato.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

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

  ngOnInit() {
    // 1. Pega o usuário logado
    this.usuario = this.authService.getUsuarioLogado();
    console.log('1. Usuário Logado:', this.usuario);

    if (this.usuario?.foto) {
      this.foto = this.authService.getFoto?.() || localStorage.getItem('foto') || '';
    }

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

    // 3. Se for Cliente, carrega o dashboard de saldo e o extrato
    if (this.usuario.tipoUsuario === 'CLIENTE') {
      this.carregarDashboard();
      this.carregarExtrato();
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

  async onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.usuario) return;

    const resultado = await this.authService.uploadFoto(this.usuario.id, input.files[0]);

    if (resultado.sucesso && resultado.foto) {
      this.foto = resultado.foto;

      // Atualiza o localStorage
      const atualizado = { ...this.usuario, foto: resultado.foto };
      localStorage.setItem('usuarioLogado', JSON.stringify(atualizado));
      this.usuario = atualizado;
      this.cdr.detectChanges();
    } else {
      alert('❌ Erro: ' + resultado.erro);
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
    if (!this.usuario?.email) return;

    this.authService.esqueceuSenha(this.usuario.email).then((resultado) => {
      if (resultado.sucesso) {
        alert(
          '📧 E-mail enviado para ' + this.usuario?.email + '!\nVerifique sua caixa de entrada.',
        );
      } else {
        alert('❌ Erro ao enviar e-mail: ' + resultado.erro);
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

  iconeMovimentacao(tipo: string): string {
    const icones: Record<string, string> = {
      DEPOSITO: '💰',
      SAQUE: '💸',
      TRANSFERENCIA: '🔄',
      INVESTIMENTO: '📈',
      RENDIMENTO: '📊',
    };
    return icones[tipo] ?? '🔁';
  }
}
