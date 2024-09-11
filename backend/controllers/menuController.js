const db = require('../models/database');

exports.getMenu = (req, res) => {
    const query = `
        SELECT p.id, p.nombre_producto, p.precio, c.nombre_categoria
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
    `;
    
    db.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
};