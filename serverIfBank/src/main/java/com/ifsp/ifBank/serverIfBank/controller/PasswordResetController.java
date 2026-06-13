package com.ifsp.ifBank.serverIfBank.controller;

import com.ifsp.ifBank.serverIfBank.model.dto.ForgotPasswordRequest;
import com.ifsp.ifBank.serverIfBank.model.dto.ResetPasswordRequest;
import com.ifsp.ifBank.serverIfBank.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    // envia o email com token UUID
    // token que é passado no link dentro do email,
    // quando o usuario prenche tudo ele confere no back se
    // o token é o mesmo e se for ele troca se nao nao torca


    //emvia email
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        passwordResetService.enviarEmailReset(request);
        return ResponseEntity.ok("Link de redefinição enviado para " + request.getEmail());
    }


    //valida e troca de fato
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.redefinirSenha(request);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }
}