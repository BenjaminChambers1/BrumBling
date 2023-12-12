const router = require('express').Router();
const multer  = require('multer');
const upload = multer({ dest: '/tmp/' });
const { authenticate_token } = require('./auth.js');

module.exports = knex => {
    const users = require('./users.js')(knex);
    const items = require('./items.js')(knex);
    const categories = require('./categories.js')(knex); 
    const reservations = require('./reservations.js')(knex);
    const collections = require('./collected.js')(knex);

    router.post('/users/log-in', users.log_in);
    router.post('/users/sign-up', users.sign_up);

    router.post('/items/create', authenticate_token, upload.single('file'), items.create_item);
    router.post('/items/edit', authenticate_token, upload.single('file'), items.edit_item);
    router.post('/items/delete', authenticate_token, items.delete_item);
    
    router.post('/categories/get', authenticate_token, categories.get_categories);
    router.post('/categories/create', authenticate_token, categories.create_category);
    router.post('/categories/edit', authenticate_token, categories.edit_category);
    router.post('/categories/delete', authenticate_token, categories.delete_category);

    router.post('/reservations/get', authenticate_token, reservations.get_reservations);
    router.post('/reservation/confirm', authenticate_token, reservations.confirm_reservation);
    router.post('/reservation/delete', authenticate_token, reservations.delete_reservation);

    router.post('/collections/get', authenticate_token, collections.get_collections);
    router.post('/collections/get-export', authenticate_token, collections.get_collections_export);

    return router;
}