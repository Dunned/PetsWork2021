const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'codigo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async(req, codigo, contrasena, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE codigo = ?', [codigo]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasena, user.contrasena)
        if (validPassword) {
            done(null, user);
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'codigo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async(req, codigo, contrasena, done) => {
    const cod = req.body.codigo;
    const tamano = cod.length;

    if (tamano == 8) {
        const {
            nombre,
            apellido,
            genero,
            correo,
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
        const row = await pool.query('SELECT * FROM users WHERE codigo = ?', [nuevaP.codigo]);
        if (row.length > 0) {
            return done(null, false, req.flash('message', 'El DNI ya ha sido registrado'));
        } else {
            const resultP = await pool.query('INSERT INTO personas SET ?', [nuevaP]);
            nuevaP.id = resultP.insertId;

            const id_persona = nuevaP.id;
            const id_rol = 1;
            const nuevoU = {
                codigo,
                contrasena,
                id_rol,
                id_persona
            }

            nuevoU.contrasena = await helpers.encryptPassword(contrasena);
            const result = await pool.query('INSERT INTO users SET ?', [nuevoU]);
            nuevoU.id = result.insertId;

            return done(null, nuevoU);
        }
    } else if (tamano == 11) {
        const {
            rsocial,
            pais,
            telefono,
            correo,
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
            direccion,
            pagina,
            fb
        };

        const row = await pool.query('SELECT * FROM users WHERE codigo = ?', [nuevaE.codigo]);
        if (row.length > 0) {
            return done(null, false, req.flash('message', 'El RUC ya ha sido registrado'));
        } else {
            const resultE = await pool.query('INSERT INTO empresas SET ?', [nuevaE]);
            nuevaE.id = resultE.insertId;

            const id_empresa = nuevaE.id;
            const id_rol = 2;
            const nuevoU = {
                codigo,
                contrasena,
                id_rol,
                id_empresa
            }

            nuevoU.contrasena = await helpers.encryptPassword(contrasena);
            const result = await pool.query('INSERT INTO users SET ?', [nuevoU]);
            nuevoU.id = result.insertId;

            return done(null, nuevoU);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});