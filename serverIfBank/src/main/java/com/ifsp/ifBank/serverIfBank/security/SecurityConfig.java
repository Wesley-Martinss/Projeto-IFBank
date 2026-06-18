package com.ifsp.ifBank.serverIfBank.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Rotas públicas (sem token)
                        .requestMatchers("/usuarios/login").permitAll()
                        .requestMatchers("/usuarios/registrar").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()

                        // Só GERENTE
                        .requestMatchers("/usuarios/pendentes").hasRole("GERENTE")
                        .requestMatchers("/usuarios/aprovar/**").hasRole("GERENTE")

                        // Só ADMIN
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/produtos-investimento/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/produtos-investimento/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/produtos-investimento/**").hasRole("ADMIN")

                        // GET para PRODUTOS (CLIENTE e ADMIN)
                        .requestMatchers(HttpMethod.GET, "/produtos-investimento/**").authenticated()

                        // CLIENTE, GERENTE e ADMIN autenticados
                        .requestMatchers("/usuarios/*/foto").authenticated()
                        .requestMatchers("/movimentacoes/**").hasRole("CLIENTE")

                        // Qualquer outra rota precisa estar autenticado
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfig() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}