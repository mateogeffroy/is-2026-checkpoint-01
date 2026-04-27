CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    legajo VARCHAR(20) NOT NULL,
    feature VARCHAR(100) NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

INSERT INTO members (nombre, apellido, legajo, feature, servicio, estado) VALUES
('Mateo Arturo', 'Geffroy', '32.027', 'Feature 01 y 04', 'Infraestructura / Base de Datos', 'En desarrollo'),
('Luciana', 'Martino', '30.499', 'Feature 02', 'Frontend', 'En desarrollo'),
('German', 'Altamirano', '31.044', 'Feature 03', 'Backend', 'En desarrollo'),
('Benjamin', 'Briones', '32.101', 'Feature 05', 'Portainer', 'En desarrollo');