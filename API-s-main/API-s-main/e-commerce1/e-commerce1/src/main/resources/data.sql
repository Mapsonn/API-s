INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (1, 'Calzado');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (2, 'Remeras');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (3, 'Abrigos');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (4, 'Camisas');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (5, 'Pantalones');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (6, 'Ropa interior');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (7, 'Pantalones cortos');



DELETE FROM producto_imagenes WHERE producto_id IN (1, 2);
DELETE FROM producto WHERE id IN (1, 2);