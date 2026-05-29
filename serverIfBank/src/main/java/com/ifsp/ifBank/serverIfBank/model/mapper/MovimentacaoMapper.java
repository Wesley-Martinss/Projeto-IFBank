package com.ifsp.ifBank.serverIfBank.model.mapper;

import com.ifsp.ifBank.serverIfBank.model.MovimentacaoConta;
import com.ifsp.ifBank.serverIfBank.model.dto.MovimentacaoResumoDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.web.bind.annotation.Mapping;

@Mapper(componentModel = "spring")
public interface MovimentacaoMapper {

    MovimentacaoMapper INSTANCE = Mappers.getMapper(MovimentacaoMapper.class);

    MovimentacaoResumoDTO toDTO(MovimentacaoConta entity);

    MovimentacaoConta toEntity(MovimentacaoResumoDTO dto);
}