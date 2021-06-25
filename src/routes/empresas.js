const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isEmpresa } = require('../lib/auth');
const helpers = require('../lib/helpers');

//Enviar Datos
router.get('/', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id_empresa } = req.user;
    const empresa = await pool.query('SELECT * FROM empresas WHERE id = ?', [id_empresa]);
    const trabajos = await pool.query('SELECT trabajos.id,trabajos.puesto, trabajos.Npostulantes, estado.estados AS estado, trabajos.created_at FROM trabajos INNER JOIN estado ON trabajos.estado = estado.id WHERE trabajos.empresa_id = ? ORDER BY created_at DESC', [id_empresa]);
    res.render('empresa/perfilE', { empresa, trabajos });
});

/*
//Recibir Datos
router.post('/', async(req, res) => {
    res.send('perfil persona');
});
*/

//Editar Datos
router.get('/editar/:id_empresa', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id_empresa } = req.user;
    const Empresa = await pool.query('SELECT * FROM empresas WHERE id = ?', [id_empresa]);
    res.render('empresa/editarE', { empresa: Empresa[0] });
});
router.post('/editar/:id_empresa', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id_empresa } = req.user;
    const {
        codigo,
        rsocial,
        pais,
        telefono,
        correo,
        contrasena,
        direccion,
        pagina,
        fb
    } = req.body;
    const nuevaE = {
        codigo,
        rsocial,
        pais,
        telefono,
        correo,
        contrasena,
        direccion,
        pagina,
        fb
    };
    const id_rol = 2;
    const nuevoU = {
        codigo,
        contrasena,
        id_rol,
        id_empresa
    }
    console.log(nuevaE);
    console.log(nuevoU);
    nuevoU.contrasena = await helpers.encryptPassword(contrasena);
    await pool.query('UPDATE empresas set ? WHERE id = ?', [nuevaE, id_empresa]);
    await pool.query('UPDATE users set ? WHERE id = ?', [nuevoU, id_empresa]);
    await pool.query('UPDATE trabajos set empresa_name = ? WHERE empresa_id = ?', [rsocial, id_empresa])
    res.redirect('/empresa');
});

/*
//Eliminar Datos
router.delete('/delete/:id', async(req, res) => {
    res.send('perfil persona');
});
*/

module.exports = router;