INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (1, 'Calzado');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (2, 'Remeras');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (3, 'Abrigos');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (4, 'Camisas');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (5, 'Pantalones');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (6, 'Ropa interior');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (7, 'Pantalones cortos');


INSERT IGNORE INTO usuario (id, nombre, apellido, email, username, password) 
VALUES (1, 'Admin', 'TPO', 'admin@mail.com', 'admin', 'Admin123!');

INSERT IGNORE INTO producto (id, nombre, descripcion, precio, stock, categoria_id, imagen_url, usuario_id) 
VALUES (1, 'Zapatillas Running', 'Zapatillas para correr Pro', 85000.0, 10, 1, 'zapatillas.jpg', 1);

INSERT IGNORE INTO producto (id, nombre, descripcion, precio, stock, categoria_id, imagen_url, usuario_id) 
VALUES (2, 'Remera Algodón', 'Remera básica negra', 15000.0, 20, 2, 'remera-negra.jpg', 1);