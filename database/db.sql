 CREATE DATABASE petswork3;

 USE petswork3;

CREATE TABLE roles(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	roles VARCHAR(60) NOT NULL
);

INSERT INTO roles (id,roles) VALUES 
(1,'persona'),
(2,'empresa');

CREATE TABLE personas (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    codigo INT NOT NULL,
    nombre VARCHAR(225) NOT NULL,
    apellido VARCHAR(225) NOT NULL,
    genero VARCHAR(225) NOT NULL,
    correo VARCHAR (225) NOT NULL,
    contrasena VARCHAR (225) NOT NULL,
    edad INT(11) NOT NULL,
    celular INT(11) NOT NULL,
    pais VARCHAR(225) NOT NULL
);
-- Tabla Empresas
CREATE TABLE empresas(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    codigo BIGINT(15) NOT NULL,
    rsocial VARCHAR(225) NOT NULL,
    pais VARCHAR (225) NOT NULL,
    telefono INT(11) NOT NULL,
    correo VARCHAR (255) NOT NULL,
    contrasena VARCHAR (225) NOT NULL,
    direccion VARCHAR (225) NOT NULL,
    pagina VARCHAR (255) NOT NULL,
    fb VARCHAR (255) NOT NULL
);

CREATE TABLE estado (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    estados VARCHAR(225) NOT NULL
);

INSERT INTO estado (id,estados) VALUES 
(1,'Vigente'),
(2,'Concluido');

CREATE TABLE users (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT(11) NOT NULL,
    id_persona INT(11) ,
    id_empresa INT(11) ,
    FOREIGN KEY(id_persona) REFERENCES personas(id),
    FOREIGN KEY(id_empresa) REFERENCES empresas(id),
    FOREIGN KEY(id_rol) REFERENCES roles(id)
);

CREATE TABLE estadoP (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    estados VARCHAR(225) NOT NULL
);

INSERT INTO estadoP (id,estados) VALUES 
(1,'Postular'),
(2,'Postulando');

CREATE TABLE trabajos(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    puesto VARCHAR(225) NOT NULL,
    descripcion LONGTEXT NOT NULL,
    pais VARCHAR (225) NOT NULL,
    cate VARCHAR (225) NOT NULL,
    rango VARCHAR (225) NOT NULL,
    empresa_id INT(11),
    empresa_name VARCHAR (225),
    estado INT,
    Npostulantes INT,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    diferencia INT ,
    FOREIGN KEY(estado) REFERENCES estado(id),
    FOREIGN KEY(empresa_id) REFERENCES empresas(id)
);

CREATE TABLE postulantes(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NOT NULL,
    trabajo_id INT NOT NULL,
    url_postulante VARCHAR(225) NOT NULL,
    estado INT NOT NULL,
    FOREIGN KEY(id_persona) REFERENCES personas(id),
    FOREIGN KEY(trabajo_id) REFERENCES trabajos(id),
    FOREIGN KEY(estado) REFERENCES estadoP(id)
);

CREATE TABLE filter(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	puesto VARCHAR(225),
    descripcion LONGTEXT,
    pais VARCHAR (225),
    cate VARCHAR (225),
    rango VARCHAR (225),
    empresa_id INT(11),
    empresa_name VARCHAR (225),
    persona_id INT(11),
    estado INT,
    Npostulantes INT,
    created_at timestamp,
    diferencia INT
);

