module.exports = async knex => {
    const items = process.env.DB_ITEMS;
    const exists = await knex.schema.hasTable(items);

    console.log(`Checking if the table ${items} exists in database.`);
    if (!exists) {
        console.log(`Creating table items in database.`);
        await knex.schema.createTable(items, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.string('description');
            table.string('image_url');
            table.integer('category_id');
            table.decimal('price',14,2);
            table.integer('stock');
            table.specificType('keyword_IDs', 'INT[]')
        });
    }
}