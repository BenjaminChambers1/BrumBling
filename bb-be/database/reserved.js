module.exports = async knex => {
    const reserved = process.env.DB_RESERVED;
    const items = process.env.DB_ITEMS;
    const exists = await knex.schema.hasTable(reserved);

    console.log(`Checking if the table ${reserved} exists in database.`);
    if (!exists) {
        console.log(`Creating table reserved in database.`);
        await knex.schema.createTable(reserved, (table) => {
            table.increments('id');
            table.integer('item_id');
            table.string('email').notNullable();
            table.date('date_reserved');
            table.string('collection_name').notNullable();
        });
    }
}