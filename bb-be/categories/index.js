const router = require('express').Router();

module.exports = knex => {
    const categories = require('./categories.js')(knex);

    router.get('/get', categories.get_categories);

    return router;
}