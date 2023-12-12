module.exports = async knex => {
    const collected = process.env.DB_COLLECTED;
    const exists = await knex.schema.hasTable(collected);

    console.log(`Checking if the table ${collected} exists in database.`);
    if (!exists) {
        console.log(`Creating table collected in database.`);
        await knex.schema.createTable(collected, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.string('category');
            table.decimal('price',14,2);
            table.date('date_collected');
        });
    }
}