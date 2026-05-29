USE ifbank;


SELECT * FROM usuario;

SELECT * FROM conta;

SELECT * FROM chaves_transferencia;

SELECT * FROM investimento;

SELECT * FROM movimentacao_conta;


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
    '123456',
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
    '654321',
    'GERENTE',
    '222.222.222-22',
    'maria@gmail.com',
    '1995-08-20 00:00:00',
    'Rua B',
    '(16)98888-8888',
    'ATIVA',
    true
);


