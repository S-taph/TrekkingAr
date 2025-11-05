-- Agregar columnas para lockout de cuenta
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0 NOT NULL COMMENT 'Número de intentos fallidos de login consecutivos',
ADD COLUMN IF NOT EXISTS locked_until DATETIME NULL COMMENT 'Fecha hasta la cual la cuenta está bloqueada',
ADD COLUMN IF NOT EXISTS last_failed_login DATETIME NULL COMMENT 'Fecha del último intento fallido de login';
