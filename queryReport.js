const queryReport = async (req, res, next) => {
    const parametros = req.params;
    const url = req.url;
    console.log(`
    Fecha: ${new Intl.DateTimeFormat('es-CL', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Santiago' }).format(Date.now())}
    Url: ${url}
    Parámetros: ${JSON.stringify(parametros)}
    `);
    next();
};

module.exports = { queryReport };
