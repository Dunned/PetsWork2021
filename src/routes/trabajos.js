const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isEmpresa } = require('../lib/auth');

//Enviar Datos
router.get('/registro', [isLoggedIn, isEmpresa], async(req, res) => {
    res.render('auten/registroT');
});

router.post('/registro', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id_empresa } = req.user;
    const Empresa = await pool.query('SELECT * FROM empresas WHERE id = ?', [id_empresa]);
    const { rsocial } = Empresa[0];
    const { puesto, descripcion, pais, cate, rango } = req.body;
    const estado = 1;
    const estadoP = 1;
    const Npostulantes = 0;
    const nuevoT = {
        puesto,
        descripcion,
        pais,
        cate,
        rango,
        empresa_id: id_empresa,
        empresa_name: rsocial,
        estado,
        Npostulantes
    };
    await pool.query('INSERT INTO trabajos set ?', [nuevoT]);
    res.redirect('/empresa');
});

router.get('/:id', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id } = req.params;
    const Trabajo = await pool.query('SELECT trabajos.id, trabajos.puesto,trabajos.descripcion, trabajos.pais, trabajos.cate, trabajos.rango, trabajos.empresa_id,trabajos.empresa_name,estado.estados as estado, trabajos.Npostulantes, trabajos.created_at FROM trabajos INNER JOIN estado ON trabajos.estado = estado.id WHERE trabajos.id = ?', [id]);
    const postulantes = await pool.query('select postulantes.id, personas.nombre as nombre, personas.apellido as apellido, postulantes.url_postulante as cv, postulantes.trabajo_id from postulantes inner join personas on postulantes.id_persona = personas.id WHERE trabajo_id = ?', [id]);
    res.render('trabajo/perfilT', { trabajo: Trabajo[0], postulantes });
});

router.post('/:id', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id } = req.params;
    const { estadoE } = req.body;
    if (estadoE === 'Concluido') {
        estado = 2;
    } else {
        estado = 1
    }
    await pool.query('UPDATE trabajos set estado = ? WHERE id = ?', [estado, id]);
    res.redirect('/empresa');
});


/*
//Recibir Datos
router.post('/:id', async(req, res) => {
    res.send('persona/perfilP');
});
*/

//Editar Datos
router.get('/editar/:id', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id } = req.params;
    const Trabajo = await pool.query('SELECT * FROM trabajos WHERE id = ?', [id]);
    res.render('trabajo/editarT', { trabajo: Trabajo[0] });
});
router.post('/editar/:id', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id } = req.params;
    const { id_empresa } = req.user;
    const Empresa = await pool.query('SELECT * FROM empresas WHERE id = ?', [id_empresa]);
    const { rsocial } = Empresa[0];
    const { puesto, descripcion, pais, cate, rango } = req.body;
    console.log(req.body);
    const nuevoT = {
        puesto,
        descripcion,
        pais,
        cate,
        rango,
        empresa_id: id_empresa,
        empresa_name: rsocial
    };
    await pool.query('UPDATE trabajos set ? WHERE id = ?', [nuevoT, id]);
    res.redirect('/empresa');
});

router.get('/eliminar/:id', [isLoggedIn, isEmpresa], async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM postulantes WHERE trabajo_id = ?', [id]);
    await pool.query('DELETE FROM trabajos WHERE id = ?', [id]);
    res.redirect('/empresa');
});

/*
//Eliminar Datos
router.delete('/delete/:id', async(req, res) => {
    res.send('perfil borrado');
});
*/




module.exports = router;