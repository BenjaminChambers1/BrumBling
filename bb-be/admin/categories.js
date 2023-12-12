let knex;

const get_categories = async (req, res) => {
    const { page, page_size, search_term } = req.query;
    const categories_query = knex(process.env.DB_CATEGORIES)
        .orderBy('id')
        .where(qb => {
            if (search_term) qb.where('name', 'ilike', `%${search_term}%`)
        });

    if (page && page_size) {
        categories_query.limit(page_size)
            .offset((page - 1) * page_size)
    }

    const categories = await categories_query.catch(console.log);

    if (!categories) return res.status(500).json({ message: 'Error getting categories' });

    const count_query = await knex(process.env.DB_CATEGORIES)
        .count('id')
        .where(qb => {
          if (search_term) qb.where('name', 'ilike', `%${search_term}%`)
        })
        .catch(console.log);

    if (!categories && !count_query) return res.status(500).json({
        message: 'Error fetching categories.'
    });

    res.json({ categories, total_results: parseInt(count_query[0]?.count ?? 0) });
};

const create_category = async (req, res) => {
    const { name } = req.body;

    if (!name) return res.json({
        message: 'Error creating category'
    });
    
    const category  = await knex(process.env.DB_CATEGORIES)
        .insert({ name })
        .catch(err => [console.log(err)]);

    if (!category) return res.json({
        message: 'Error creating category'
    });

    return res.json({
        message: 'Creating category'
    });
}

const edit_category = async (req, res) => {
    const { id, name } = req.body;
    const [ category ] = await knex(process.env.DB_CATEGORIES)
        .where({ id })
        .catch(err => [console.log(err)]);

    if (!category) return res.json({
        message: 'Could not find category to edit'
    });

    const edited_category = await knex(process.env.DB_CATEGORIES)
        .where({ id })
        .update({ name })
        .catch(err => [console.log(err)]);
    
        if (!edited_category) return res.json({
            message: 'Error edited category'
        });

    return res.json({
        message: 'Edited category'
    });
}

const delete_category = async (req, res) => {
    const { id } = req.body;
    
    const deleted = await knex(process.env.DB_CATEGORIES)
        .where({ id })
        .del()
        .catch(err => [console.log(err)]);

    if (!deleted) return res.json({
        message: 'Error deleting category'
    });

    return res.json({
        message: 'Deleted category'
    });
}

module.exports = db => {
    knex = db;
    return {
        get_categories,
        create_category,
        edit_category,
        delete_category
    }
}