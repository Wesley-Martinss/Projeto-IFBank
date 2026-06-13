import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../services/usuario';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})
export class CadastroUsuario {

  fotoPreview: string = '';
  fotoBase64: string = '';

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

  constructor(private usuarioServer: Usuario, private router: Router) {}

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
    const usuario = {
      ...this.cadastroForm.value,
      foto: this.fotoBase64 || null  
    };

    this.usuarioServer.cadastrarUsuario(usuario).subscribe({
      next: (resposta) => {
        console.log('Sucesso:', resposta);
        alert('Cadastro realizado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.log('Erro:', erro);
      },
    });
  }
}