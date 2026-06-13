package com.ifsp.ifBank.serverIfBank.service;


import com.ifsp.ifBank.serverIfBank.model.Usuario;
import com.ifsp.ifBank.serverIfBank.model.dto.ForgotPasswordRequest;
import com.ifsp.ifBank.serverIfBank.model.dto.ResetPasswordRequest;
import com.ifsp.ifBank.serverIfBank.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void enviarEmailReset(ForgotPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        String link = frontendUrl + "/resetar-senha?token=" + token;

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(usuario.getEmail());
        mensagem.setSubject("ifBank — Redefinição de Senha");
        mensagem.setText(
                "Olá, " + usuario.getNome() + "!\n\n" +
                        "Clique no link abaixo para redefinir sua senha:\n\n" +
                        link + "\n\n" +
                        "O link expira em 1 hora.\n\n" +
                        "Se você não solicitou isso, ignore este e-mail."
        );
        mensagem.setFrom("bancodigital133@gmail.com");
        mailSender.send(mensagem);
    }

    public void redefinirSenha(ResetPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido ou já utilizado"));

        if (usuario.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado. Solicite um novo link.");
        }

        if (!request.getSenhaAtual().equals(usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        usuario.setSenha(request.getNovaSenha()); // ⚠️ Se usa BCrypt: passwordEncoder.encode(request.getNovaSenha())
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        usuarioRepository.save(usuario);
    }
}