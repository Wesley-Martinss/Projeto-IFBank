package com.ifsp.ifBank.serverIfBank.model.mapper;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.UsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.web.bind.annotation.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioDTO toDTO(Usuario entity);

    Usuario toEntity(UsuarioDTO dto);
}