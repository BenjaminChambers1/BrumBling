let knex;

const { send_email } = require('./../helpers/email');
const fs = require('fs/promises');

const item = async (req, res) => {
    const { email, name, item_id } = req.body.reserve_data;
    const DB_ITEMS = process.env.DB_ITEMS
    const item = await knex(DB_ITEMS)
        .select(
            `${DB_ITEMS}.id`, `${DB_ITEMS}.name`, `${DB_ITEMS}.description`, `${DB_ITEMS}.image_url`, `${DB_ITEMS}.price`, `${DB_ITEMS}.stock`,
            `${process.env.DB_CATEGORIES}.name as category`,
        )
        .leftJoin(process.env.DB_CATEGORIES, `${DB_ITEMS}.category_id`, `${process.env.DB_CATEGORIES}.id`)
        .where(`${DB_ITEMS}.id`, item_id)
        .limit(1);

    const [ existing_reservations ] = await knex(process.env.DB_RESERVED)
        .where({ item_id })
        .count();

    let allow_reservation =
        (!existing_reservations?.count && item[0].stock > 1) ||
        (existing_reservations?.count < item[0].stock)
    
    if (allow_reservation) {
        const [ reservation ] = await knex(process.env.DB_RESERVED)
            .insert({
                date_reserved: new Date(),
                email,
                collection_name: name,
                item_id
            })
            .returning('*')

        let HTML = await fs.readFile(`${__dirname}/../helpers/email_template/confirmation.html`, 'utf-8');

        let today = new Date

        const mergeVars = {
            name,
            item: item[0].name,
            code: reservation.id.toString().substr(-4),
            date: new Date(today.setDate(today.getDate() + 3)).toDateString()
        };

        for (const key in mergeVars) {
            const regex = new RegExp("{{" + key + "}}", "ig");
            HTML = HTML.replace(regex, mergeVars[key]);
        }

        const response = await send_email(email, HTML, `Confirmation Email`);

        return res.json({});
    }
    return res.json({message: 'Error with reserving item'});
};

module.exports = db => {
    knex = db;
    return {
        item,
    }
}