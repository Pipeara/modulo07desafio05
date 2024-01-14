const format = require('pg-format');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'joyas',
    allowExitOnIdle: true
});

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    const offset = (page - 1) * limits;
    const [campo, direccion] = order_by.split("_");
    const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);
    pool.query(formattedQuery);
    const { rows: joyas } = await pool.query(formattedQuery);
    return joyas;
}

const prepararHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `/joyas/joya/${j.id}`,
        }
    });

    const totalJoyas = joyas.length;

    let stockTotal = 0;

    for (let joya of joyas) {
        stockTotal += joya.stock;
    }

    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return HATEOAS;
}

const ObtenerJoyasPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
    const filtros = [];
    const values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        filtros.push(`${campo} ${comparador} $${values.length}`);
    }

    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = "SELECT * FROM inventario";

    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(" AND ")}`;
    }

    const { rows: inventario } = await pool.query(consulta, values);

    return inventario;
}

const ObtenerJoya = async (id) => {
    const consulta = 'SELECT * FROM inventario WHERE id = $1';
    const result = await pool.query(consulta, [id]);
    return result;
}

module.exports = { obtenerJoyas, prepararHATEOAS, ObtenerJoyasPorFiltros, ObtenerJoya };
