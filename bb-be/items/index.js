const router = require('express').Router();

module.exports = knex => {
    const items = require('./items.js')(knex);

    router.post('/get', items.get_items);
    router.post('/get-by-category', items.get_items_by_category);
    router.post('/get-by-id', items.get_item_by_id);

    return router;
}