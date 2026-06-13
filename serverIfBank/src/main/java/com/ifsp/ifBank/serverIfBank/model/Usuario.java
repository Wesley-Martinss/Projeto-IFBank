package com.ifsp.ifBank.serverIfBank.model;

import com.ifsp.ifBank.serverIfBank.model.enuns.StatusConta;
import com.ifsp.ifBank.serverIfBank.model.enuns.TipoUsuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String email;

    private LocalDateTime dataCadastro;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;

    @Enumerated(EnumType.STRING)
    private StatusConta statusConta;

    private boolean ativo;


    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "foto", columnDefinition = "LONGTEXT")
    private String foto;

}
