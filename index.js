const express = require('express');
const { obtenerJoyas, obtenerJoyasFiltradas } = require('./consultas.js');
const cors = require('cors');
const { queryReport, contadorConsultas } = require('./queryReport'); // Importar los middlewares

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Aplicar los middlewares a todas las rutas
app.use(queryReport);
//app.use(contadorConsultas);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Ruta para obtener todas las joyas con estructura HATEOAS
app.get("/joyas", async (req, res) => {
    try {
        // Obtener parámetros de la query string
        const { limits, page, order_by } = req.query;

        // Obtener joyas según los parámetros
        const joyas = await obtenerJoyas({ limits, page, order_by });

        // Estructura HATEOAS
        const joyasHATEOAS = joyas.map(joya => {
            return {
                id: joya.id,
                nombre: joya.nombre,
                descripcion: joya.descripcion,
                _links: {
                    self: { href: `/joyas/${joya.id}`, method: 'GET' },
                }
            };
        });

        res.json(joyasHATEOAS);
    } catch (error) {
        console.error('Error al obtener joyas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get("/joyas/filtros", async (req, res) => {
    try {
        // Obtener parámetros de la query string
        const { precio_max, precio_min, categoria, metal } = req.query;

        // Obtener joyas filtradas según los parámetros
        const joyasFiltradas = await obtenerJoyasFiltradas({ precio_max, precio_min, categoria, metal });

        // Estructura HATEOAS para las joyas filtradas
        const joyasFiltradasHATEOAS = joyasFiltradas.map(joya => {
            return {
                id: joya.id,
                nombre: joya.nombre,
                descripcion: joya.descripcion,
                _links: {
                    self: { href: `/joyas/${joya.id}`, method: 'GET' },
                }
            };
        });

        res.json(joyasFiltradasHATEOAS);
    } catch (error) {
        console.error('Error al obtener joyas filtradas', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
