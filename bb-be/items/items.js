let knex;

const get_items = async (req, res) => {
    const DB_ITEMS = process.env.DB_ITEMS
    const { page, page_size, search_term, sort } = req.query;
    const items_query = knex(DB_ITEMS)
        .select(
            `${DB_ITEMS}.id`, `${DB_ITEMS}.name`, `${DB_ITEMS}.description`, `${DB_ITEMS}.image_url`, `${DB_ITEMS}.price`, `${DB_ITEMS}.stock`,
            `${process.env.DB_CATEGORIES}.name as category`,
        )
        .leftJoin(process.env.DB_CATEGORIES, `${DB_ITEMS}.category_id`, `${process.env.DB_CATEGORIES}.id`)
        .where(qb => {
            if (search_term) qb.where(`${DB_ITEMS}.name`, 'ilike', `%${search_term}%`)
        });

    if (sort) {
        switch (sort) {
            case 'name':
                items_query.orderBy(`${DB_ITEMS}.name`, 'asc');
                break;
            case 'price':
                items_query.orderBy(`${DB_ITEMS}.price`, 'desc');
                break;
            case 'stock':
                items_query.orderBy(`${DB_ITEMS}.stock`, 'desc');
                break;
        }
    } else {
        items_query.orderBy('id');
    }

    if (page && page_size) {
        items_query.limit(page_size)
            .offset((page - 1) * page_size)
    }

    const items = await items_query.catch(console.log);

    if (!items) return res.status(500).json({ message: 'Error getting categories' });

    const reservations = await knex(process.env.DB_RESERVED)
        .select('item_id')
        .catch(console.log);

    let reservations_obj = {};
    if (reservations.length) {
        for (const reservation of reservations) {
            if (reservations_obj[Object.entries(reservation)[0][1]]) {
                reservations_obj[Object.entries(reservation)[0][1]] ++;
            } else {
                reservations_obj[Object.entries(reservation)[0][1]] = 1
            }
        }
        for (const item of items) {
            if (reservations_obj[item.id]) {
                item.reserved = reservations_obj[item.id];
            }
        }
    }

    const count_query = await knex(DB_ITEMS)
        .count('id')
        .where(qb => {
          if (search_term) qb.where('name', 'ilike', `%${search_term}%`)
        })
        .catch(console.log);

    if (!items && !count_query) return res.status(500).json({
        message: 'Error fetching categories.'
    });

    res.json({ items, total_results: parseInt(count_query[0]?.count ?? 0) });
};

const get_items_by_category = async (req, res) => {
    const DB_ITEMS = process.env.DB_ITEMS
    const { page, page_size, search_term, sort, category_id } = req.query;
    const items_query = knex(DB_ITEMS)
        .select(
            `${DB_ITEMS}.id`, `${DB_ITEMS}.name`, `${DB_ITEMS}.description`, `${DB_ITEMS}.image_url`, `${DB_ITEMS}.price`, `${DB_ITEMS}.stock`,
            `${process.env.DB_CATEGORIES}.name as category`,
        )
        .leftJoin(process.env.DB_CATEGORIES, `${DB_ITEMS}.category_id`, `${process.env.DB_CATEGORIES}.id`)
        .where(qb => {
            if (search_term) qb.where(`${DB_ITEMS}.name`, 'ilike', `%${search_term}%`)
            if (Number(category_id)) qb.andWhere(`${DB_ITEMS}.category_id`, category_id)
        });

    if (sort) {
        switch (sort) {
            case 'name':
                items_query.orderBy(`${DB_ITEMS}.name`, 'asc');
                break;
            case 'price':
                items_query.orderBy(`${DB_ITEMS}.price`, 'desc');
                break;
            case 'stock':
                items_query.orderBy(`${DB_ITEMS}.stock`, 'desc');
                break;
        }
    } else {
        items_query.orderBy('name');
    }

    if (page && page_size) {
        items_query.limit(page_size)
            .offset((page - 1) * page_size)
    }

    const items = await items_query.catch(console.log);

    if (!items) return res.status(500).json({ message: 'Error getting categories' });

    const reservations = await knex(process.env.DB_RESERVED)
        .select('item_id')
        .catch(console.log);

    let reservations_obj = {};
    if (reservations.length) {
        for (const reservation of reservations) {
            if (reservations_obj[Object.entries(reservation)[0][1]]) {
                reservations_obj[Object.entries(reservation)[0][1]] ++;
            } else {
                reservations_obj[Object.entries(reservation)[0][1]] = 1
            }
        }
        for (const item of items) {
            if (reservations_obj[item.id]) item.stock = item.stock - reservations_obj[item.id];
        }
    }

    const count_query = await knex(DB_ITEMS)
        .count('id')
        .where(qb => {
          if (search_term) qb.where('name', 'ilike', `%${search_term}%`)
          if (Number(category_id)) qb.andWhere(`${DB_ITEMS}.category_id`, category_id)
        })
        .catch(console.log);

    if (!items && !count_query) return res.status(500).json({
        message: 'Error fetching categories.'
    });

    res.json({ items, total_results: parseInt(count_query[0]?.count ?? 0) });
};

const get_item_by_id = async (req, res) => {
    const DB_ITEMS = process.env.DB_ITEMS
    const { item_id } = req.body;
    const item = await knex(DB_ITEMS)
        .select(
            `${DB_ITEMS}.id`, `${DB_ITEMS}.name`, `${DB_ITEMS}.description`, `${DB_ITEMS}.image_url`, `${DB_ITEMS}.price`, `${DB_ITEMS}.stock`,
            `${process.env.DB_CATEGORIES}.name as category`,
        )
        .leftJoin(process.env.DB_CATEGORIES, `${DB_ITEMS}.category_id`, `${process.env.DB_CATEGORIES}.id`)
        .where(`${DB_ITEMS}.id`, item_id)
        .limit(1)

    const reservations = await knex(process.env.DB_RESERVED)
        .select('item_id')
        .catch(console.log);

    let reservations_obj = {};
    if (reservations.length) {
        for (const reservation of reservations) {
            if (reservations_obj[Object.entries(reservation)[0][1]]) {
                reservations_obj[Object.entries(reservation)[0][1]] ++;
            } else {
                reservations_obj[Object.entries(reservation)[0][1]] = 1
            }
        }
        if (reservations_obj[item[0].id]) item[0].stock = item[0].stock - reservations_obj[item[0].id];
    }

    res.json({ item });
};

module.exports = db => {
    knex = db;
    return {
        get_items,
        get_items_by_category,
        get_item_by_id
    }
}