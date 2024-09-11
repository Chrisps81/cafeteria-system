const stripe = require('stripe')('TU_CLAVE_STRIPE');
const db = require('../models/database');

exports.processPayment = async (req, res) => {
    const { total, cart } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        // Crear una nueva factura
        const [invoiceResult] = await db.query('INSERT INTO facturas (total) VALUES (?)', [total]);
        const invoiceId = invoiceResult.insertId;

        // Insertar detalles de la factura
        for (const item of cart) {
            await db.query('INSERT INTO factura_detalles (factura_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)', [
                invoiceId, item.id, item.quantity, item.price
            ]);
            // Actualizar inventario
            await db.query('UPDATE inventario SET cantidad = cantidad - ? WHERE id = ?', [item.quantity, item.id]);
        }

        res.json({ message: "Pago procesado con éxito", clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};