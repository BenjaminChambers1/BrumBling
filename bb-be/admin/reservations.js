let knex;

const get_reservations = async (req, res) => {
    const { page, page_size, search_term } = req.query;
    const DB_RESERVED = process.env.DB_RESERVED;
    const DB_ITEMS = process.env.DB_ITEMS;
    const reservations_query = knex(DB_RESERVED)
        .select(
            `${DB_RESERVED}.id`, `${DB_RESERVED}.email`, `${DB_RESERVED}.date_reserved`, `${DB_RESERVED}.collection_name`,
            `${DB_ITEMS}.name as name`,
        )
        .leftJoin(DB_ITEMS, `${DB_RESERVED}.item_id`, `${DB_ITEMS}.id`)
        .where(qb => {
            if (search_term) qb.where(`${DB_ITEMS}.name`, 'ilike', `%${search_term}%`)
            if (search_term) qb.orWhere(`${DB_RESERVED}.email`, 'ilike', `%${search_term}%`)
            if (search_term) qb.orWhere(`${DB_RESERVED}.collection_name`, 'ilike', `%${search_term}%`)
        });

    if (page && page_size) {
        reservations_query.limit(page_size)
            .offset((page - 1) * page_size)
    }

    const reservations = await reservations_query.catch(console.log);

    if (!reservations) return res.status(500).json({ message: 'Error getting categories' });

    const count_query = await knex(process.env.DB_RESERVED)
        .count('id')
        .where(qb => {
            if (search_term) qb.orWhere('email', 'ilike', `%${search_term}%`)
            if (search_term) qb.orWhere('collection_name', 'ilike', `%${search_term}%`)
        })
        .catch(console.log);

    if (!reservations && !count_query) return res.status(500).json({
        message: 'Error fetching categories.'
    });

    res.json({ reservations, total_results: parseInt(count_query[0]?.count ?? 0) });
};

const confirm_reservation = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.json({
        message: 'Error confirming reservation'
    });
    const DB_RESERVED = process.env.DB_RESERVED;
    const DB_ITEMS = process.env.DB_ITEMS;
    const DB_CATEGORIES = process.env.DB_CATEGORIES;

    const [ reservation ] = await knex(DB_RESERVED)
        .select(
            `${DB_RESERVED}.id`,
            `${DB_ITEMS}.name as name`, `${DB_ITEMS}.price as price`,
            `${DB_CATEGORIES}.name as category`
        )
        .leftJoin(DB_ITEMS, `${DB_RESERVED}.item_id`, `${DB_ITEMS}.id`)
        .leftJoin(DB_CATEGORIES, `${DB_ITEMS}.category_id`, `${DB_CATEGORIES}.id`)
        .where(`${DB_RESERVED}.id`, id)
        .limit(1)
        .catch(err => [console.log(err)]);

    if (!reservation) return res.json({
        message: 'Error Finding Reservation'
    });

    const [ item ] = await knex(DB_RESERVED)
        .select(`${DB_RESERVED}.item_id as item_id`, `${DB_ITEMS}.stock as stock`)
        .leftJoin(DB_ITEMS, `${DB_RESERVED}.item_id`, `${DB_ITEMS}.id`)
        .where(`${DB_RESERVED}.id`, id)
        .limit(1)
        .catch(err => [console.log(err)]);

    if (!item || !item.stock || !item.item_id) return res.json({
        message: 'Error Finding item'
    });

    const item_query = knex(DB_ITEMS)
        .update({
            stock: item.stock - 1,
        })
        .where('id', item.item_id)
        .catch(err => [console.log(err)]);

    const collection_query = knex(process.env.DB_COLLECTED)
        .insert({
            name: reservation.name,
            category: reservation.category,
            price: reservation.price,
            date_collected: new Date()
        })
        .catch(err => [console.log(err)]);

    const deleted_query = knex(process.env.DB_RESERVED)
        .where({ id })
        .del()
        .catch(err => [console.log(err)]);

    const [collection, deleted, item_stock] = await Promise.all([collection_query, deleted_query, item_query]);

    if (!collection || !deleted || !item_stock) return res.status(500).json({ message: 'Error confirming Reservation' });

    return res.json({});
}

const delete_reservation = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.json({
        message: 'Error deleting reservation'
    });
    
    const deleted = await knex(process.env.DB_RESERVED)
        .where({ id })
        .del()
        .catch(err => [console.log(err)]);

    if (!deleted) return res.json({
        message: 'Error deleting reservation'
    });

    return res.json({
        message: 'Deleted reservation'
    });
}

module.exports = db => {
    knex = db;
    require('./expiry_cron')(knex);
    return {
        get_reservations,
        confirm_reservation,
        delete_reservation
    }
}