// models/usuario.model.ts
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: 'CLIENTE' | 'GERENTE' | 'ADMIN';
  foto: string;
  token: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string; // formato ISO yyyy-MM-dd
  statusConta?: string;
  ativo?: boolean;
  dataCadastro?: string;
}