-- 0. Comunicación con el servidor en UTF-8 (evita problemas con las tildes)
SET NAMES utf8mb4;

-- 1. Base de datos de prácticas
CREATE DATABASE IF NOT EXISTS tienda_practicas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tienda_practicas;

-- 2. Tabla con clave primaria y tres columnas más
CREATE TABLE IF NOT EXISTS productos (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)  NOT NULL,
  precio DECIMAL(8,2)  NOT NULL,
  stock  INT           NOT NULL DEFAULT 0
);

-- 3. Datos iniciales (sirven para comprobar que el borrado es selectivo)
INSERT INTO productos (nombre, precio, stock) VALUES
  ('Auriculares', 19.99, 25),
  ('Ratón inalámbrico', 14.50, 40),
  ('Teclado', 29.90, 15);

-- 4. (Opcional) Usuario de prácticas con permisos solo sobre esta base
CREATE USER IF NOT EXISTS 'practicas'@'localhost' IDENTIFIED BY 'practicas123';
GRANT SELECT, INSERT, DELETE ON tienda_practicas.* TO 'practicas'@'localhost';
FLUSH PRIVILEGES;