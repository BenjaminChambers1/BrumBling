const router = require('express').Router();

module.exports = knex => {
    const reserve = require('./reserve.js')(knex);

    router.post('/item', reserve.item);

    return router;
}