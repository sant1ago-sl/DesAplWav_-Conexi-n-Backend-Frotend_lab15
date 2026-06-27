use railway;

show tables;

select * from products;

INSERT INTO products (nombre, precio, descripcion, createdAt, updatedAt) VALUES
('Laptop Lenovo IdeaPad 3', 1599.90, 'Laptop básica para estudio y oficina', NOW(), NOW()),
('Mouse Logitech M280', 59.90, 'Mouse inalámbrico ergonómico', NOW(), NOW()),
('Monitor Samsung 27"', 799.00, 'Monitor Full HD de 27 pulgadas', NOW(), NOW()),
('Teclado Redragon Kumara K552', 189.50, 'Teclado mecánico con iluminación LED', NOW(), NOW()),
('Audífonos Sony WH-CH510', 249.00, 'Audífonos inalámbricos con buena autonomía', NOW(), NOW());
