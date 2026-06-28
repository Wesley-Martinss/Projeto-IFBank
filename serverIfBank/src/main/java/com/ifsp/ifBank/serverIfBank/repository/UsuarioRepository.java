package com.ifsp.ifBank.serverIfBank.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.enuns.StatusConta;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    List<Usuario> findByStatusConta(StatusConta statusConta);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByResetToken(String resetToken);

}
