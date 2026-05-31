export type TipoMovimentacao = 'DEPOSITO' | 'SAQUE' | 'TRANSFERENCIA' | 'INVESTIMENTO';

export interface MovimentacaoDTO {
  idContaOrigem?: number;
  chaveDestinatario?: string;
  idContaDestinatario?: number;
  nomeContaDestinatario?: string;
  valor?: number;
  descricao?: string;
  tipoMovimentacao?: TipoMovimentacao;
}