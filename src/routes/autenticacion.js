const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


// SIGNUP
router.get('/registroE', isNotLoggedIn, (req, res) => {
    res.render('auten/registroE');
});

router.post('/registroE', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/usuario',
    failureRedirect: '/registroE',
    failureFlash: true
}));


router.get('/registroP', isNotLoggedIn, (req, res) => {
    res.render('auten/registroP');
});

router.post('/registroP', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/usuario',
    failureRedirect: '/registroP',
    failureFlash: true
}));



// SINGIN
router.get('/ingreso', isNotLoggedIn, (req, res) => {
    res.render('auten/ingreso');
});

router.post('/ingreso', isNotLoggedIn, (req, res, next) => {
    /*
        req.check('codigo', 'El usuario es requerido').notEmpty();
        req.check('contrasena', 'Contraseña requerida').notEmpty();
        /const errors = req.validationErrors();
        if (errors.length > 0) {
            //req.flash('message', errors[0].msg);
            res.redirect('/ingreso');
        }
    */
    passport.authenticate('local.signin', {
        successRedirect: '/usuario',
        failureRedirect: '/ingreso',
        failureFlash: true
    })(req, res, next);
});

router.get('/salir', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/');
});


router.get('/usuario', isLoggedIn, async(req, res) => {
    const rol = req.user.id_rol;

    if (rol == 1) {
        res.redirect('/persona');
    } else if (rol == 2) {
        res.redirect('/empresa');
    }
});



module.exports = router;