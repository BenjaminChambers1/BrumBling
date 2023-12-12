let knex;

const get_categories = async (req, res) => {
    let found_categories = await knex(process.env.DB_CATEGORIES)
        .orderBy('id')
        .catch(console.log);

    // if (!found_categories) {
    //     return res.status(200).json({ id: user.id, access_token, username });
    // }
    
    return res.status(200).json({found_categories});
}



module.exports = db => {
    knex = db;
    return {
        get_categories,
    }
}