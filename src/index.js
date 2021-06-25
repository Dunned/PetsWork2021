const express = require('express');
const morgan = require('morgan');
const path = require('path'); //importar libreria para señalar camino o URL
const exphbs = require('express-handlebars'); //importar la libreria express-handlebars como HTML
const session = require('express-session'); //almacenar los datos en la memoria del servidor
const passport = require('passport'); //importar passport para utilizar su codigo principal
const flash = require('connect-flash'); //importar libreria para enviar mensajes a travez de las vistas
const MySQLStore = require('express-mysql-session')(session); //guardar la sesiones en mysql
const { database } = require('./keys'); //importar la base de datos del archivo keys

//inicializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 5500);
app.set('views', path.join(__dirname, 'views')); //mostrar donde se encuentra views
app.engine('.hbs', exphbs({ //configuración para usar handlebars
    defaultLayout: 'main', //función principan de handlebars
    layoutsDir: path.join(app.get('views'), 'layouts'), //concatenar la dirección de views con layouts ,en html se utiliza  {{(nombre de carpeta)}}
    partialsDir: path.join(app.get('views'), 'partials'), //concatenar la dirección de views con partials
    extname: '.hbs',
    helpers: require('./lib/handlebars'),

}));
app.set('view engine', '.hbs');


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'faztmysqlnode',
    reseave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


//Routes
app.use(require('./routes/index')); //muestra el archivo existente en la carpeta routes con su contenido
app.use(require('./routes/autenticacion'));
app.use('/empresa', require('./routes/empresas'));
app.use('/persona', require('./routes/personas'));
app.use('/trabajo', require('./routes/trabajos'));

//Public
app.use(express.static(path.join(__dirname, 'public')));


//Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});