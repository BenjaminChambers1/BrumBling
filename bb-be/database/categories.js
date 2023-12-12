module.exports = async knex => {
    const categories = process.env.DB_CATEGORIES;
    const exists = await knex.schema.hasTable(categories);

    console.log(`Checking if the table ${categories} exists in database.`);
    if (!exists) {
        console.log(`Creating table categories in database.`);
        await knex.schema.createTable(categories, (table) => {
            table.increments('id');
            table.string('name').notNullable();
        });
    }
}