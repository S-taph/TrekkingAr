-- Script para crear usuarios de prueba
-- Ejecutar después de crear las tablas

-- Insertar usuarios de prueba con diferentes roles
INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, rol, experiencia_previa, activo, fecha_registro) VALUES
('Admin', 'Sistema', 'admin@trekking.com', '$2a$12$LQv3c1yqBwEHxPuNYkmmNOHSuANiYcnMjxJ2QHdvpD6.U3NKKu8gG', '+54911234567', 'admin', 'Administrador del sistema', true, NOW()),
('Carlos', 'Mendez', 'carlos@example.com', '$2a$12$LQv3c1yqBwEHxPuNYkmmNOHSuANiYcnMjxJ2QHdvpD6.U3NKKu8gG', '+54911234568', 'guia', 'Guía de montaña con 10 años de experiencia', true, NOW()),
('Ana', 'Rodriguez', 'ana@example.com', '$2a$12$LQv3c1yqBwEHxPuNYkmmNOHSuANiYcnMjxJ2QHdvpD6.U3NKKu8gG', '+54911234569', 'guia', 'Especialista en trekking y escalada', true, NOW()),
('Miguel', 'Torres', 'miguel@example.com', '$2a$12$LQv3c1yqBwEHxPuNYkmmNOHSuANiYcnMjxJ2QHdvpD6.U3NKKu8gG', '+54911234570', 'guia', 'Guía certificado en alta montaña', true, NOW()),
('Juan', 'Perez', 'juan@example.com', '$2a$12$LQv3c1yqBwEHxPuNYkmmNOHSuANiYcnMjxJ2QHdvpD6.U3NKKu8gG', '+54911234571', 'cliente', 'Principiante en trekking', true, NOW());

-- Nota: La contraseña para todos los usuarios de prueba es "password123"
-- Hash generado con bcrypt, 12 rounds
