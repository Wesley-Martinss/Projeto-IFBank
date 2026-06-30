// pages/perfil/perfil.ts
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { TopbarComponent } from '../../shared/topbar/topbar';
import { IconComponent } from '../../shared/icon/icon';
import { Usuario } from '../../models/Usuario';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent, IconComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  foto = '';
  enviandoFoto = false;

  nome = '';
  email = '';
  telefone = '';
  endereco = '';
  dataNascimento = '';
  cpf = '';

  salvando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  @ViewChild('fotoInput') fotoInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private perfilService: PerfilService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
  const usuarioLogado = this.authService.getUsuarioLogado();
  if (!usuarioLogado) {
    this.router.navigate(['/login']);
    return;
  }

  this.usuario = usuarioLogado;
  this.foto = this.authService.getFoto() || '';
  this.preencherFormulario(usuarioLogado);

  // Busca dados completos no backend (CPF, telefone, endereço, etc. podem não vir no JWT)
  try {
    const completo = await this.perfilService.buscarPerfil(usuarioLogado.id);
    const usuarioAtualizado = { ...usuarioLogado, ...completo };
    this.usuario = usuarioAtualizado;
    this.preencherFormulario(usuarioAtualizado);
    this.cdr.detectChanges();
  } catch {
    // Mantém os dados básicos do token caso a busca falhe
  }
}
private preencherFormulario(u: Usuario) {
  this.nome = u.nome ?? '';
  this.email = u.email ?? '';
  this.telefone = u.telefone ?? '';
  this.endereco = u.endereco ?? '';
  this.cpf = u.cpf ?? '';
  this.dataNascimento = u.dataNascimento ? u.dataNascimento.substring(0, 10) : '';
}

  voltar() {
    this.router.navigate(['/home']);
  }

  rotuloTipoUsuario(tipo?: string | null): string {
    const rotulos: Record<string, string> = {
      CLIENTE: 'Cliente',
      GERENTE: 'Gerente',
      ADMIN: 'Administrador',
    };
    return tipo ? rotulos[tipo] ?? tipo : '';
  }

  triggerFotoInput() {
    this.fotoInput.nativeElement.click();
  }

  async onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.usuario) return;

    this.enviandoFoto = true;
    this.mensagemErro = '';
    const resultado = await this.authService.uploadFoto(this.usuario.id, input.files[0]);

    if (resultado.sucesso && resultado.foto) {
      this.foto = resultado.foto;
      this.authService.salvarFoto(resultado.foto);
      this.usuario = { ...this.usuario, foto: resultado.foto };
    } else {
      this.mensagemErro = 'Erro ao enviar a foto: ' + resultado.erro;
    }
    this.enviandoFoto = false;
    this.cdr.detectChanges();
  }

  async salvar() {
    if (!this.usuario) return;
    this.salvando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const resultado = await this.perfilService.atualizarPerfil(this.usuario.id, {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      endereco: this.endereco,
      dataNascimento: this.dataNascimento,
    });

    if (resultado.sucesso) {
      this.mensagemSucesso = 'Dados atualizados com sucesso!';
      this.usuario = { ...this.usuario, ...resultado.usuario } as UsuarioDTO;
      setTimeout(() => {
        this.mensagemSucesso = '';
        this.cdr.detectChanges();
      }, 3000);
    } else {
      this.mensagemErro = resultado.erro || 'Erro ao salvar dados.';
    }
    this.salvando = false;
    this.cdr.detectChanges();
  }

  alterarSenha() {
    const email = this.email || (this.usuario as any)?.sub || '';
    if (!email) return;
    this.authService.esqueceuSenha(email).then((resultado) => {
      if (resultado.sucesso) {
        alert('E-mail enviado para ' + email + '!\nVerifique sua caixa de entrada.');
      } else {
        alert('Erro ao enviar e-mail: ' + resultado.erro);
      }
    });
  }
}