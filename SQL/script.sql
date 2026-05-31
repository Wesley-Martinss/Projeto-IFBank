CREATE DATABASE ifbank;
USE ifbank;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('CLIENTE', 'GERENTE') NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_nascimento DATETIME NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    status_conta ENUM(
        'PENDENTE_APROVACAO',
        'ATIVA',
        'BLOQUEADA',
        'ENCERRADA'
    ) NOT NULL DEFAULT 'PENDENTE_APROVACAO',
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE conta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    numero_conta VARCHAR(20) NOT NULL UNIQUE,
    agencia VARCHAR(10) NOT NULL,
    saldo DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conta_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

CREATE TABLE chaves_transferencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conta_id INT NOT NULL,
    chave_transferencia VARCHAR(150) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chave_conta
        FOREIGN KEY (conta_id)
        REFERENCES conta(id)
);

CREATE TABLE investimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conta_id INT NOT NULL,
    tipo_investimento ENUM(
        'POUPANCA',
        'CDB',
        'LCI',
        'LCA',
        'TESOURO_DIRETO',
        'FUNDO_INVESTIMENTO'
    ) NOT NULL,
    valor_investido DECIMAL(15,2) NOT NULL,
    rendimento DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    duracao_dias INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_investimento_conta
        FOREIGN KEY (conta_id)
        REFERENCES conta(id)
);

CREATE TABLE movimentacao_conta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conta_origem_id INT NULL,
    conta_destino_id INT NULL,
    tipo_movimentacao ENUM(
        'DEPOSITO',
        'SAQUE',
        'TRANSFERENCIA',
        'INVESTIMENTO',
        'RENDIMENTO',
        'ESTORNO'
    ) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    descricao VARCHAR(255),
    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacao_conta_origem
        FOREIGN KEY (conta_origem_id)
        REFERENCES conta(id),

    CONSTRAINT fk_movimentacao_conta_destino
        FOREIGN KEY (conta_destino_id)
        REFERENCES conta(id)
);
ALTER TABLE movimentacao_conta ADD COLUMN tipo_operacao VARCHAR(10);


