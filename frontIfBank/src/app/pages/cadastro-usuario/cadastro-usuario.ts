import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../services/usuario';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})
export class CadastroUsuario {
  cadastroForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    dataNascimento: new FormControl('', Validators.required),
    endereco: new FormControl('', Validators.required),
    telefone: new FormControl('', Validators.required),
    tipoUsuario: new FormControl('', Validators.required),
  });

  constructor(
    private usuarioServer: Usuario,
    private router: Router,
  ) {}

  onSubmit() {
    const usuario = this.cadastroForm.value;
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
