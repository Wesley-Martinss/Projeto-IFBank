import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/usuarios';

  async login(email: string, senha: string): Promise<UsuarioDTO | null> {
    try {
      const res = await fetch(`${this.api}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (res.status === 200) {
        const usuario: UsuarioDTO = await res.json();
        // Salva o usuário no localStorage para persistir a sessão
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return usuario;
      }
      return null;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  }

  getUsuarioLogado(): UsuarioDTO | null {
    const dados = localStorage.getItem('usuarioLogado');
    return dados ? JSON.parse(dados) : null;
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
  }

  async listarPendentes() {
    try {
      const res = await fetch(`${this.api}/pendentes`);
      if (res.status === 200) {
        return await res.json();
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error);
      return [];
    }
  }
  //Promise indica que uma função ou método executa uma operação assíncrona (como buscar dados ou verificar login) e, no futuro, retornará um resultado do tipo booleano (verdadeiro ou falso).
  async aprovarConta(usuarioId: number, gerenteId: number): Promise<{sucesso: boolean, erro?: string}> {
    try {
      const res = await fetch(`${this.api}/aprovar/${usuarioId}?gerenteId=${gerenteId}`, {
        method: 'POST',
      });
      if (res.status === 200) {
        return { sucesso: true };
      } else {
        const textoErro = await res.text();
        return { sucesso: false, erro: textoErro };
      }
    } catch (error: any) {
      console.error('Erro ao aprovar conta:', error);
      return { sucesso: false, erro: error.message };
    }
  }

  async esqueceuSenha(email: string): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return { sucesso: true };
      const texto = await res.text();
      return { sucesso: false, erro: texto };
    } catch (error: any) {
      return { sucesso: false, erro: error.message };
    }
  }

  async redefinirSenha(
    token: string,
    senhaAtual: string,
    novaSenha: string
  ): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senhaAtual, novaSenha }),
      });
      if (res.ok) return { sucesso: true };
      const texto = await res.text();
      return { sucesso: false, erro: texto };
    } catch (error: any) {
      return { sucesso: false, erro: error.message };
    }
  }

  async uploadFoto(usuarioId: number, arquivo: File): Promise<{ sucesso: boolean; foto?: string; erro?: string }> {
      try {
        // Converte o arquivo para base64
        const base64 = await this.fileParaBase64(arquivo);

        const res = await fetch(`http://localhost:8080/usuarios/${usuarioId}/foto`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: base64
        });

        if (res.ok) {
          return { sucesso: true, foto: base64 };
        }
        return { sucesso: false, erro: await res.text() };
      } catch (error: any) {
        return { sucesso: false, erro: error.message };
      }
    }

    private fileParaBase64(arquivo: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = () => reject('Erro ao ler arquivo');
      });
    }
}
