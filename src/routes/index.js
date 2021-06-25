const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//Inicio de Index Publicaciones Tabla 3x2--------------------------------
router.get('/', async(req, res) => {
    const trabajos = await pool.query('SELECT * FROM trabajos ORDER BY created_at DESC LIMIT 0, 6');
    const path = req.originalUrl;
    console.log(path);
    res.render('index/index', { trabajos });
});

router.get('/nosotros', async(req, res) => {

    res.render('index/nosotros');
});

router.get('/info', async(req, res) => {

    res.render('index/info');
});

router.get('/error', async(req, res) => {

    res.render('index/error');
});

//Fin registra trabajo--------
/*
router.get('/trabajos', isLoggedIn, async(req, res) => { //  localhost:5500/trabajos
    const lista = await pool.query('SELECT * FROM trabajos ORDER BY created_at DESC'); //extrae la base de datos
    res.render('index/lista', { lista }); //carpeta donde se encuentra HTML    - {lista}: manda la base de datos a la pagina
});
*/


module.exports = router;