module.exports = (knex) => {
    require('./categories.js')(knex);
    require('./keywords.js')(knex);
    require('./users.js')(knex);
    require('./items.js')(knex);
    require('./reserved.js')(knex);
    require('./collected.js')(knex);
    return knex;
}

