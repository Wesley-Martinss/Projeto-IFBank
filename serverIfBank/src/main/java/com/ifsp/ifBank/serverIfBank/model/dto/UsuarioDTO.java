package com.ifsp.ifBank.serverIfBank.model.dto;

import com.ifsp.ifBank.serverIfBank.model.enuns.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Integer id;

    private String nome;

    private String email;

    private String foto;

    private TipoUsuario tipoUsuario;

    private String token;


}
