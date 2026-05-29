package com.ifsp.ifBank.serverIfBank.repository;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
