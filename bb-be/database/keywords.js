module.exports = async knex => {
    const keywords = process.env.DB_KEYWORDS;
    const exists = await knex.schema.hasTable(keywords);

    console.log(`Checking if the table ${keywords} exists in database.`);
    if (!exists) {
        console.log(`Creating table keywords in database.`);
        await knex.schema.createTable(keywords, (table) => {
            table.increments('id');
            table.string('name').notNullable();
        });
    }
}