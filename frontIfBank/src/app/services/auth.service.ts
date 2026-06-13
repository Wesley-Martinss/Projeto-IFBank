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
          localStorage.setItem('token', usuario.token);
          localStorage.setItem('foto', usuario.foto || '');
       // somente o token
       // localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return usuario;
      }
      return null;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  }

  getUsuarioLogado(): any | null {
  const token = this.getToken();

  if (!token) {
    return null;
  }

  return this.decodeToken(token);
}

getFoto(): string {
  return localStorage.getItem('foto') || '';
}

private decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];

    const decoded = atob(
      payload.replace(/-/g, '+').replace(/_/g, '/')
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
  getToken(): string | null {
    return localStorage.getItem('token');
  }

 logout() {
  localStorage.removeItem('token');
}

  // ✅ token adicionado
  async listarPendentes() {
    try {
      const res = await fetch(`${this.api}/pendentes`, {
        headers: { 'Authorization': `Bearer ${this.getToken()}` }
      });
      if (res.status === 200) return await res.json();
      return [];
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error);
      return [];
    }
  }

  // ✅ token adicionado
  async aprovarConta(usuarioId: number, gerenteId: number): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`${this.api}/aprovar/${usuarioId}?gerenteId=${gerenteId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.getToken()}` }
      });
      if (res.status === 200) return { sucesso: true };
      return { sucesso: false, erro: await res.text() };
    } catch (error: any) {
      console.error('Erro ao aprovar conta:', error);
      return { sucesso: false, erro: error.message };
    }
  }

  // público — sem token
  async esqueceuSenha(email: string): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return { sucesso: true };
      return { sucesso: false, erro: await res.text() };
    } catch (error: any) {
      return { sucesso: false, erro: error.message };
    }
  }

  // público — sem token
  async redefinirSenha(token: string, senhaAtual: string, novaSenha: string): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senhaAtual, novaSenha }),
      });
      if (res.ok) return { sucesso: true };
      return { sucesso: false, erro: await res.text() };
    } catch (error: any) {
      return { sucesso: false, erro: error.message };
    }
  }

  async uploadFoto(usuarioId: number, arquivo: File): Promise<{ sucesso: boolean; foto?: string; erro?: string }> {
    try {
      const base64 = await this.fileParaBase64(arquivo);
      const res = await fetch(`${this.api}/${usuarioId}/foto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: base64
      });
      if (res.ok) return { sucesso: true, foto: base64 };
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