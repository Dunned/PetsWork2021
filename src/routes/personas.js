const express = require('express');
const { ContextHandlerImpl } = require('express-validator/src/chain');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isPersona } = require('../lib/auth');
const helpers = require('../lib/helpers');

contador = 0
contardor10 = contador + 10;

//Enviar Datos
router.get('/', [isLoggedIn, isPersona], async(req, res) => {;

    const DBfilter = await pool.query('SELECT * FROM trabajos');

    if (DBfilter !== 0) {
        for (i = 0; i < DBfilter.length; i++) {
            await pool.query('UPDATE trabajos set diferencia = (timestampdiff(day, ? ,current_timestamp)) WHERE trabajos.id = ?', [DBfilter[i].created_at, DBfilter[i].id]);
        }
    }
    filter = await pool.query('SELECT * FROM filter');
    trabajos = await pool.query('SELECT * FROM trabajos');

    if (filter.length === 0 && trabajos.length !== 0) {
        delete trabajos;
        trabajos = await pool.query('SELECT * FROM trabajos WHERE trabajos.diferencia <= 31 ORDER BY created_at DESC LIMIT ?,?', [contador, contardor10]);
        const DBfilter = await pool.query("SELECT * FROM trabajos");
        for (i = 0; i < DBfilter.length; i++) {
            await pool.query('INSERT INTO filter set ?', [DBfilter[i]]);
        }
        res.render('persona/perfilP', { trabajos });

    } else if (trabajos.length >= filter.length) {
        //delete trabajos;
        trabajos = await pool.query('SELECT * FROM filter WHERE filter.estado = 1 and filter.diferencia <= 31 ORDER BY created_at DESC LIMIT ?,?', [contador, contardor10]);
        res.render('persona/perfilP', { trabajos });

    } else if (trabajos.length === 0 && filter.length === 0) {
        res.render('persona/perfilP');
    }

});

router.post('/', [isLoggedIn, isPersona], async(req, res) => {;
    await pool.query('TRUNCATE filter');
    const tabla = req.body;
    if (tabla.busqueda !== undefined) {
        const busqueda = tabla.busqueda;
        const DBfilter = await pool.query("SELECT * FROM trabajos WHERE puesto LIKE '%" + busqueda + "%' or descripcion LIKE '%" + busqueda + "%' or pais LIKE '%" + busqueda + "%' or cate LIKE '%" + busqueda + "%' or rango LIKE '%" + busqueda + "%' or empresa_name LIKE '%" + busqueda + "%' ");
        for (i = 0; i < DBfilter.length; i++) {
            await pool.query('INSERT INTO filter set ?', [DBfilter[i]]);
        }
    } else {
        const DBtabla = [
            [null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ];

        if ( /*tabla.fecha === undefined &&*/
            tabla.pais === undefined && tabla.categoria === undefined && tabla.rango === undefined) {
            const DBfilter = await pool.query('SELECT * FROM trabajos');
            for (i = 0; i < DBfilter.length; i++) {
                await pool.query('INSERT INTO filter set ?', [DBfilter[i]]);
            }
        } else {
            for (i = 0; i < DBtabla.length; i++) {
                switch (i) {

                    // case 0:
                    //     if (tabla.fecha === undefined) {
                    //         continue;
                    //     } else {
                    //         for (j = 0; j < 3; j++) {
                    //             if (tabla.fecha[j] === undefined) {
                    //                 continue;
                    //             } else {
                    //                 if (tabla.fecha[0].length == 1) {
                    //                     DBtabla[i][j] = tabla.fecha;
                    //                 } else {
                    //                     DBtabla[i][j] = tabla.fecha[j];
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     break;

                    case 1:
                        if (tabla.pais === undefined) {
                            continue;
                        } else {
                            for (k = 0; k < 7; k++) {
                                if (tabla.pais[k] === undefined) {
                                    continue;
                                } else {
                                    if (tabla.pais[0].length == 1) {
                                        DBtabla[i][k] = tabla.pais;
                                    } else {
                                        DBtabla[i][k] = tabla.pais[k];
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        if (tabla.categoria === undefined) {
                            continue;
                        } else {
                            for (l = 0; l < 7; l++) {
                                if (tabla.categoria[l] === undefined) {
                                    continue;
                                } else {
                                    if (tabla.categoria[0].length == 1) {
                                        DBtabla[i][l] = tabla.categoria;
                                    } else {
                                        DBtabla[i][l] = tabla.categoria[l];
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        if (tabla.rango === undefined) {
                            continue;
                        } else {
                            for (m = 0; m < 7; m++) {
                                if (tabla.rango[m] === undefined) {
                                    continue;
                                } else {
                                    if (tabla.rango[0].length == 1) {
                                        DBtabla[i][m] = tabla.rango;
                                    } else {
                                        DBtabla[i][m] = tabla.rango[m];
                                    }
                                }
                            }
                        }
                        break;
                }
            }
            const DBfilter = await pool.query('SELECT * FROM trabajos WHERE pais = ? or pais = ? or pais = ? or pais = ? or pais = ? or pais = ? or pais = ? or cate = ? or cate = ? or cate = ? or cate = ? or cate = ? or cate = ? or cate = ? or rango = ? or rango = ? or rango = ? or rango = ? or rango = ? or rango = ? or rango = ? ', [DBtabla[1][0], DBtabla[1][1], DBtabla[1][2], DBtabla[1][3], DBtabla[1][4], DBtabla[1][5], DBtabla[1][6], DBtabla[2][0], DBtabla[2][1], DBtabla[2][2], DBtabla[2][3], DBtabla[2][4], DBtabla[2][5], DBtabla[2][6], DBtabla[2][0], DBtabla[3][1], DBtabla[3][2], DBtabla[3][3], DBtabla[3][4], DBtabla[3][5], DBtabla[3][6]]);
            for (i = 0; i < DBfilter.length; i++) {
                await pool.query('INSERT INTO filter set ?', [DBfilter[i]]);
            }
        }

    }
    res.redirect('/persona');
});

//Enviar Datos
router.get('/adelante', [isLoggedIn, isPersona], async(req, res) => {;
    contador = contador + 10;
    res.redirect("/persona");
});
//Enviar Datos
router.get('/atraz', [isLoggedIn, isPersona], async(req, res) => {;
    if (contador === 0) {
        res.redirect("/persona");
    } else {
        contador = contador - 10;
        res.redirect("/persona");
    }
});

//Postular Trabajo
router.get('/filtro/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id } = req.params;
    const { id_persona } = req.user;
    const trabajos = await pool.query('SELECT * FROM filter WHERE filter.estado = 1 and filter.diferencia <= 7 ORDER BY created_at DESC LIMIT 0,6');
    const avisoP = await pool.query('select filter.id, filter.descripcion, filter.empresa_name, filter.puesto, filter.pais,filter.cate, filter.rango, filter.created_at, filter.diferencia, estado.estados as estado from filter inner join estado on filter.estado = estado.id  WHERE filter.id = ? and estado = 1 and filter.diferencia <= 7 ORDER BY created_at DESC LIMIT 0,6', [id]);
    const Postula = await pool.query('select *,estadoP.estados as estado from postulantes inner join estadoP on postulantes.estado = estadoP.id where trabajo_id = ? and id_persona = ?', [id, id_persona]);
    res.render('persona/filtroT', { trabajos, aviso: avisoP[0], postula: Postula[0] });
});

router.get('/postular/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id } = req.params;
    const avisoP = await pool.query('select filter.id, filter.descripcion, filter.empresa_name, filter.puesto, filter.pais,filter.cate, filter.rango, filter.created_at, filter.diferencia, estado.estados as estado from filter inner join estado on filter.estado = estado.id WHERE filter.id = ?', [id]);
    res.render('persona/postularT', { aviso: avisoP[0] });
});

router.post('/postular/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id_persona } = req.user;
    const { id } = req.params;
    const { cv } = req.body;
    const nuevoP = {
        id_persona: id_persona,
        trabajo_id: id,
        url_postulante: cv,
        estado: 2
    }
    await pool.query('INSERT INTO postulantes set ?', [nuevoP]);
    Npostulante = await pool.query('SELECT Npostulantes FROM trabajos WHERE  id = ?', [id]);
    Npostulante[0].Npostulantes = Npostulante[0].Npostulantes + 1;
    await pool.query('UPDATE trabajos set Npostulantes = ? WHERE id = ?', [Npostulante[0].Npostulantes, id]);
    res.redirect('/persona');
});

router.get('/postular/editar/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id } = req.params;
    const avisoP = await pool.query('select filter.id, filter.descripcion, filter.empresa_name, filter.puesto, filter.pais,filter.cate, filter.rango, filter.created_at, filter.diferencia, estado.estados as estado from filter inner join estado on filter.estado = estado.id WHERE filter.id = ?', [id]);
    const Postulante = await pool.query('SELECT * FROM postulantes WHERE trabajo_id = ?', [id]);
    res.render('persona/editarPostu', { aviso: avisoP[0], postulante: Postulante[0] });
});

router.post('/postular/editar/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id_persona } = req.user;
    const { id } = req.params;
    const { cv } = req.body;
    const nuevoP = {
        id_persona: id_persona,
        trabajo_id: id,
        url_postulante: cv,
        estado: 2
    }
    await pool.query('UPDATE postulantes set ?', [nuevoP]);
    res.redirect('/persona');
});

router.get('/postular/eliminar/:id', [isLoggedIn, isPersona], async(req, res) => {;
    const { id } = req.params;
    await pool.query('DELETE FROM postulantes WHERE trabajo_id = ?', [id]);

    Npostulante = await pool.query('SELECT Npostulantes FROM trabajos WHERE  id = ?', [id]);
    Npostulante[0].Npostulantes = Npostulante[0].Npostulantes - 1;
    await pool.query('UPDATE trabajos set Npostulantes = ? WHERE id = ?', [Npostulante[0].Npostulantes, id]);
    res.redirect('/persona');
});

/*
//Recibir Datos
router.post('/:id', async(req, res) => {
    res.send('persona/perfilP');
});
*/

//Editar Datos
router.get('/editar/:id_persona', [isLoggedIn, isPersona], async(req, res) => {
    const { id_persona } = req.user;
    const Persona = await pool.query('SELECT * FROM personas WHERE id = ?', [id_persona]);
    res.render('persona/editarP', { persona: Persona[0] });
});
router.post('/editar/:id_persona', [isLoggedIn, isPersona], async(req, res) => {
    const { id_persona } = req.user;
    const {
        codigo,
        nombre,
        apellido,
        genero,
        correo,
        contrasena,
        edad,
        celular,
        pais
    } = req.body;
    const nuevaP = {
        codigo,
        nombre,
        apellido,
        genero,
        correo,
        edad,
        celular,
        pais
    };
    const id_rol = 1;
    const nuevoU = {
        codigo,
        contrasena,
        id_rol,
        id_persona
    }
    await pool.query('UPDATE personas set ? WHERE id = ?', [nuevaP, id_persona]);
    nuevoU.contrasena = await helpers.encryptPassword(contrasena);
    await pool.query('UPDATE users set ? WHERE id = ?', [nuevoU, id_persona]);
    res.redirect('/persona');
});


/*
//Eliminar Datos
router.delete('/delete/:id', async(req, res) => {
    res.send('perfil borrado');
});
*/

module.exports = router;