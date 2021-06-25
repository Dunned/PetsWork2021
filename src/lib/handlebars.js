//configuraciones de todas las funciones handlebars
const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;