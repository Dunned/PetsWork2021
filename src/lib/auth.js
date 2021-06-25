//exportar un objetom
const pool = require('../database');

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/ingreso');
    },
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/usuario');
    },
    isPersona(req, res, next) {
        const { id_rol } = req.user;
        if (id_rol == 1) {
            return next();
        }
        return res.redirect('/');
    },
    isEmpresa(req, res, next) {
        const { id_rol } = req.user;
        if (id_rol == 2) {
            return next();
        }
        return res.redirect('/');
    }
};