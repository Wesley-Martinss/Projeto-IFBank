import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent, IconName } from '../../shared/icon/icon';
import { TopbarComponent } from '../../shared/topbar/topbar';
import {
  ChaveTransferenciaDTO,
  ChaveTransferenciaService,
  TipoChave,
} from '../../services/chave-transferencia.service';

@Component({
  selector: 'app-minhas-chaves',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent, TopbarComponent],
  templateUrl: './minhas-chaves.html',
  styleUrl: './minhas-chaves.css',
})
export class MinhasChavesComponent implements OnInit {
  chaves: ChaveTransferenciaDTO[] = [];
  carregando = true;
  erro = '';
  mensagemSucesso = '';

  criando = false;
  tipoSelecionado: TipoChave = 'EMAIL';
  valorChave = '';

  constructor(
    private chaveService: ChaveTransferenciaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarChaves();
  }

  get emailUsuario(): string {
    return this.authService.getUsuarioLogado()?.sub || '';
  }

  async carregarChaves() {
    try {
      this.carregando = true;
      this.chaves = (await this.chaveService.listarMinhasChaves()).filter((c) => c.ativo);
    } catch (e) {
      this.erro = 'Erro ao carregar suas chaves Pix.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  selecionarTipo(tipo: TipoChave) {
    this.tipoSelecionado = tipo;
    this.erro = '';

    if (tipo === 'EMAIL') {
      this.valorChave = this.emailUsuario;
    } else if (tipo === 'ALEATORIA') {
      this.valorChave = '';
    } else {
      this.valorChave = '';
    }
  }

  async criarChave() {
    if (this.criando) return;
    this.erro = '';
    this.mensagemSucesso = '';

    if (this.tipoSelecionado !== 'ALEATORIA' && !this.valorChave.trim()) {
      this.erro = 'Informe o valor da chave.';
      return;
    }

    this.criando = true;
    const resultado = await this.chaveService.criarChave(this.tipoSelecionado, this.valorChave.trim());
    this.criando = false;

    if (resultado.sucesso) {
      this.mensagemSucesso = 'Chave Pix criada com sucesso!';
      this.valorChave = '';
      await this.carregarChaves();
      setTimeout(() => {
        this.mensagemSucesso = '';
        this.cdr.markForCheck();
      }, 4000);
    } else {
      this.erro = resultado.erro || 'Erro ao criar chave.';
    }
    this.cdr.markForCheck();
  }

  async desativar(chave: ChaveTransferenciaDTO) {
    if (!confirm(`Deseja remover a chave "${chave.chave}"?`)) return;

    const resultado = await this.chaveService.desativarChave(chave.id);
    if (resultado.sucesso) {
      this.chaves = this.chaves.filter((c) => c.id !== chave.id);
      this.cdr.markForCheck();
    } else {
      alert('Erro ao remover chave: ' + resultado.erro);
    }
  }

  copiarChave(chave: string) {
    navigator.clipboard?.writeText(chave);
    this.mensagemSucesso = 'Chave copiada!';
    setTimeout(() => {
      this.mensagemSucesso = '';
      this.cdr.markForCheck();
    }, 2000);
    this.cdr.markForCheck();
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  readonly tipos: { tipo: TipoChave; label: string; icon: IconName }[] = [
    { tipo: 'EMAIL', label: 'E-mail', icon: 'mail' },
    { tipo: 'CPF', label: 'CPF', icon: 'id' },
    { tipo: 'TELEFONE', label: 'Telefone', icon: 'phone' },
    { tipo: 'ALEATORIA', label: 'Aleatória', icon: 'dice' },
  ];
}
