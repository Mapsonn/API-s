INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (1, 'Calzado');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (2, 'Remeras');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (3, 'Abrigos');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (4, 'Camisas');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (5, 'Pantalones');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (6, 'Ropa interior');
INSERT IGNORE INTO categoria (id, nombre_categoria) VALUES (7, 'Pantalones cortos');

-- Create favorito_item table if it doesn't exist (compatible with MariaDB 5.5.5)
CREATE TABLE IF NOT EXISTS favorito_item (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_favorito_producto FOREIGN KEY (producto_id) REFERENCES producto (id),
    CONSTRAINT fk_favorito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;