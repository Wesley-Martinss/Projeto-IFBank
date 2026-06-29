import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoInvestimentoDTO, ProdutoInvestimentoService } from '../../services/produto-investimento.service';
import { IconComponent } from '../../shared/icon/icon';

@Component({
  selector: 'app-admin-investimentos',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './admin-investimentos.html',
  styleUrl: './admin-investimentos.css'
})
export class AdminInvestimentosComponent implements OnInit {

  produtos: ProdutoInvestimentoDTO[] = [];
  
  produtoAtual: ProdutoInvestimentoDTO = this.getProdutoVazio();
  editando = false;
  mensagem = '';
  erro = false;

  constructor(private produtoService: ProdutoInvestimentoService) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  getProdutoVazio(): ProdutoInvestimentoDTO {
    return {
      nome: '',
      tipoInvestimento: 'CDB',
      taxaRendimentoMinuto: 0,
      prazoMinutos: 0,
      valorMinimo: 0,
      ativo: true
    };
  }

  async carregarProdutos() {
    try {
      this.produtos = await this.produtoService.findAll();
    } catch (e) {
      this.mostrarMensagem('Erro ao carregar produtos', true);
    }
  }

  async salvar() {
    try {
      if (this.editando && this.produtoAtual.id) {
        await this.produtoService.update(this.produtoAtual.id, this.produtoAtual);
        this.mostrarMensagem('Produto atualizado com sucesso!', false);
      } else {
        await this.produtoService.create(this.produtoAtual);
        this.mostrarMensagem('Produto criado com sucesso!', false);
      }
      this.cancelar();
      this.carregarProdutos();
    } catch (e) {
      this.mostrarMensagem('Erro ao salvar produto', true);
    }
  }

  editar(produto: ProdutoInvestimentoDTO) {
    this.produtoAtual = { ...produto };
    this.editando = true;
  }

  async excluir(id?: number) {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await this.produtoService.delete(id);
        this.mostrarMensagem('Produto excluído!', false);
        this.carregarProdutos();
      } catch (e) {
        this.mostrarMensagem('Erro ao excluir produto', true);
      }
    }
  }

  cancelar() {
    this.produtoAtual = this.getProdutoVazio();
    this.editando = false;
  }

  mostrarMensagem(texto: string, ehErro: boolean) {
    this.mensagem = texto;
    this.erro = ehErro;
    setTimeout(() => this.mensagem = '', 3000);
  }
}
