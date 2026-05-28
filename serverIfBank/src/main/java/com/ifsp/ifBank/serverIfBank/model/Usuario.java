package com.ifsp.ifBank.serverIfBank.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Usuario {
    private Integer id;

    private String nome;
    private String senha;
    private TipoUsuario tipoUsuario;
    private String cpf;
    private String email;
    private LocalDateTime dataCadastro;
    private LocalDateTime dataNascimento;
    private String endereco;
    private String telefone;
    private boolean ativo;

}
