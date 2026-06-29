import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../services/usuario';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, IconComponent],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})
export class CadastroUsuario {

  fotoPreview: string = '';
  fotoBase64: string = '';
  mostrarSenha = false;

  carregando = false;
  erro = '';
  sucesso = '';

  cadastroForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    dataNascimento: new FormControl('', Validators.required),
    endereco: new FormControl('', Validators.required),
    telefone: new FormControl('', Validators.required),
    tipoUsuario: new FormControl('CLIENTE'),
  });

  constructor(
    private usuarioServer: Usuario,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const arquivo = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(arquivo);
    reader.onload = () => {
      this.fotoBase64 = reader.result as string;
      this.fotoPreview = this.fotoBase64;
    };
  }

  onSubmit() {
    if (this.carregando) return;
    this.erro = '';
    this.sucesso = '';

    // Envia o CPF apenas com dígitos (evita "Data too long" e duplicados por formato)
    const cpfLimpo = (this.cadastroForm.value.cpf || '').replace(/\D/g, '');

    const usuario = {
      ...this.cadastroForm.value,
      cpf: cpfLimpo,
      foto: this.fotoBase64 || null,
    };

    this.carregando = true;
    this.cdr.detectChanges();

    this.usuarioServer.cadastrarUsuario(usuario).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = 'Conta criada com sucesso! Ela ficará pendente até a aprovação de um gerente. Redirecionando para o login...';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 2800);
      },
      error: (erro) => {
        this.carregando = false;
        // O corpo da resposta do backend (texto) vem em erro.error
        const msg = typeof erro?.error === 'string' && erro.error.trim()
          ? erro.error
          : 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.';
        this.erro = msg;
        this.cdr.detectChanges();
      },
    });
  }
}