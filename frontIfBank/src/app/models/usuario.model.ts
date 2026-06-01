export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: 'CLIENTE' | 'GERENTE' | 'ADMIN';
}
