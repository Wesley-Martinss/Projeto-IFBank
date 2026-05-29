package com.ifsp.ifBank.serverIfBank.model.mapper;

import com.ifsp.ifBank.serverIfBank.model.ChavesTransferencia;
import com.ifsp.ifBank.serverIfBank.model.dto.ChaveTransferenciaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChaveTransferenciaMapper {

    ChaveTransferenciaMapper INSTANCE = Mappers.getMapper(ChaveTransferenciaMapper.class);

    ChaveTransferenciaDTO toDTO(ChavesTransferencia entity);

    ChavesTransferencia toEntity(ChaveTransferenciaDTO dto);
}