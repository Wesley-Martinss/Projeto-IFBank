USE ifbank;


SELECT * FROM usuario;

SELECT * FROM conta;

SELECT * FROM chaves_transferencia;

SELECT * FROM investimento;

SELECT * FROM movimentacao_conta;


-- =========================================================
-- IMPORTANTE: as senhas abaixo já estão com hash BCrypt
-- (compatível com o BCryptPasswordEncoder do Spring Security).
-- Senha em texto puro de cada usuário, para uso no login:
--   gabriel@gmail.com   -> 123456
--   maria@gmail.com     -> 654321
--   pendente@gmail.com  -> 123
--   admin@ifbank.com    -> admin123
-- =========================================================

INSERT INTO usuario (
    nome,
    senha,
    tipo_usuario,
    cpf,
    email,
    data_nascimento,
    endereco,
    telefone,
    status_conta,
    ativo
) VALUES (
    'Gabriel Prudencio',
    '$2a$10$ve0g5z2c8tMzA2OdGlINj.0rUNMn7ymZZtrbz5VzeQezroXmGR/xO',
    'CLIENTE',
    '111.111.111-11',
    'gabriel@gmail.com',
    '2004-05-10 00:00:00',
    'Rua A',
    '(16)99999-9999',
    'ATIVA',
    true
);

INSERT INTO usuario (
    nome,
    senha,
    tipo_usuario,
    cpf,
    email,
    data_nascimento,
    endereco,
    telefone,
    status_conta,
    ativo
) VALUES (
    'Maria Silva',
    '$2a$10$a2YdxyQN548eMvPIhhoituTvZuim8dEy7hYxCmq1Ax2xRTpIqUzyO',
    'GERENTE',
    '222.222.222-22',
    'maria@gmail.com',
    '1995-08-20 00:00:00',
    'Rua B',
    '(16)98888-8888',
    'ATIVA',
    true
);


INSERT INTO usuario (
    nome,
    senha,
    tipo_usuario,
    cpf,
    email,
    data_nascimento,
    endereco,
    telefone,
    status_conta,
    ativo
) VALUES (
    'pendente cliente',
    '$2a$10$Br5P9NDVR6/3uUHOFlqNM.MvkIHxWnvqdRn/m7AtNL6MJJ0vB3SSO',
    'CLIENTE',
    '333.333.333-33',
    'pendente@gmail.com',
    '1995-08-20 00:00:00',
    'Rua B',
    '(16)92288-8888',
    'PENDENTE_APROVACAO',
    true
);

-- Usuário ADMIN (não passa pelo fluxo de aprovação de conta, já nasce ATIVO)
INSERT INTO usuario (
    nome,
    senha,
    tipo_usuario,
    cpf,
    email,
    data_nascimento,
    endereco,
    telefone,
    status_conta,
    ativo
) VALUES (
    'Administrador',
    '$2a$10$tCiPpyBnGlfP1tHsCOfncesMh2LKurdbfWhPSncVIfWgydR6GwVlq',
    'ADMIN',
    '444.444.444-44',
    'admin@ifbank.com',
    '1990-01-01 00:00:00',
    'Sede IFBank',
    '(16)90000-0000',
    'ATIVA',
    true
);

-- =========================================================
-- Conta corrente para o cliente já ATIVO (Gabriel).
-- Usuários GERENTE/ADMIN não possuem conta corrente.
-- =========================================================
INSERT INTO conta (usuario_id, numero_conta, agencia, saldo, ativa)
SELECT id, CAST(id AS CHAR), '0001', 1000.00, true
FROM usuario
WHERE email = 'gabriel@gmail.com';

-- Chave Pix de exemplo (e-mail do Gabriel), para já permitir testar transferências
INSERT INTO chaves_transferencia (conta_id, chave_transferencia, ativo)
SELECT c.id, u.email, true
FROM conta c
JOIN usuario u ON u.id = c.usuario_id
WHERE u.email = 'gabriel@gmail.com';
