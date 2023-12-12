let knex;

const get_collections = async (req, res) => {
    const { page, page_size, search_term, maximum_date, minimum_date } = req.query;
    const DB_COLLECTED = process.env.DB_COLLECTED;

    if (!minimum_date || !maximum_date) return res.json({
        message: 'Missing parameters.'
    });

    const collections_query = knex(DB_COLLECTED)
        .where('date_collected', '>=', minimum_date)
        .where('date_collected', '<=', maximum_date)
        .where(qb => {
            if (search_term) {
                qb.where(`${DB_COLLECTED}.name`, 'ilike', `%${search_term}%`)
                qb.orWhere(`${DB_COLLECTED}.category`, 'ilike', `%${search_term}%`)
            }
        });

    if (page && page_size) {
        collections_query.limit(page_size)
            .offset((page - 1) * page_size)
    }

    const collections = await collections_query.catch(console.log);

    const count_query = await knex(process.env.DB_COLLECTED)
        .count('id')
        .where(qb => {
            if (search_term) qb.where('name', 'ilike', `%${search_term}%`)
        })
        .catch(console.log);

    if (!collections && !count_query) return res.status(500).json({
        message: 'Error fetching categories.'
    });

    res.json({ collections, total_results: parseInt(count_query[0]?.count ?? 0) });
};

const get_collections_export = async (req, res) => {
    const { search_term, maximum_date, minimum_date } = req.query;
    const DB_COLLECTED = process.env.DB_COLLECTED;

    if (!minimum_date || !maximum_date) return res.json({
        message: 'Missing parameters.'
    });

    let collections = await knex(DB_COLLECTED)
        .where('date_collected', '>=', minimum_date)
        .where('date_collected', '<=', maximum_date)
        .where(qb => {
            if (search_term) {
                qb.where(`${DB_COLLECTED}.name`, 'ilike', `%${search_term}%`)
                qb.orWhere(`${DB_COLLECTED}.category`, 'ilike', `%${search_term}%`)
            }
        })
        .orderBy('date_collected', 'desc');

    if (!collections) return res.status(500).json({ message: 'Error getting categories' });

    let refinedData = Object.keys(collections[0]);
    refinedData.shift();
    refinedData = [refinedData];
    collections.forEach(collection => {
        let temp = [];
        Object.keys(collections[0]).forEach(key => {
            if (key === 'date_collected') {
                temp.push(collection[key].toISOString().substring(0, 10))
            } else {
                temp.push(collection[key])
            }
        });
        temp.shift();
        refinedData.push(temp);
    });
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    refinedData.forEach(row => {
        csvContent += row.join(',') + '\n'
    });
    res.json(csvContent);
};

module.exports = db => {
    knex = db;
    return {
        get_collections,
        get_collections_export
    }
}