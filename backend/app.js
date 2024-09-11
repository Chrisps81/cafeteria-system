const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const stripe = require('stripe')('TU_CLAVE_STRIPE');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Cambia a '../public' si `public` está en el directorio raíz

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Deja esto vacío si no hay contraseña
    database: 'cafeteria'
});

// Obtener menú desde la base de datos
app.get('/menu', (req, res) => {
    connection.query('SELECT * FROM productos', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Procesar el pago
app.post('/checkout', async (req, res) => {
    const { total } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100, // Stripe maneja centavos
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.json({ message: "Pago procesado con éxito", clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
});