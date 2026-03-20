-- Esquema inicial del recurso "products"
-- Dominio temático: canciones/tracks de Linkin Park (rock)
-- Los nombres de campos siguen el contrato del laboratorio (campo1..campo6)
CREATE TABLE IF NOT EXISTS products (
  id      SERIAL           PRIMARY KEY,
  campo1  TEXT             NOT NULL,
  campo2  TEXT             NOT NULL,
  campo3  TEXT             NOT NULL,
  campo4  INTEGER          NOT NULL,
  campo5  DOUBLE PRECISION NOT NULL,
  campo6  BOOLEAN          NOT NULL
);
