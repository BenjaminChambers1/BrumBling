const CronJob = require('cron').CronJob;
let knex;

const check_for_expired_reservations = async () => {
    const reserved = await knex(process.env.DB_RESERVED)
        .catch(err => [console.log(err)]);
    
    if (!reserved.length) return; //nothing to remove
    let milliseconds_in_three_days = 1000 * 60 * 60 * 24 * 3;
    let ids_to_remove = [];
    for (const entry of reserved) {
        if ((new Date - entry.date_reserved) > milliseconds_in_three_days) {
            ids_to_remove.push(entry.id);
        }
    }
    if (!ids_to_remove.length) return; //nothing to remove
    const deleted = await knex(process.env.DB_RESERVED)
        .whereIn('id', ids_to_remove)
        .del()
        .catch(err => [console.log(err)]);

    return;
}

module.exports = db => {
    knex = db;
    
    new CronJob(
        '1 0 * * *', //at one minute past midnight everyday
        async () => await check_for_expired_reservations(), // The callback function
        null,
        true,
        'Europe/London' // Timezone (CET)
    ).start();
}