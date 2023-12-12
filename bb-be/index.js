require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const knex = require('./db.js');
const db = require('./database')(knex);
const body_parser = require('body-parser'); 
app.use(body_parser.urlencoded({limit: '50mb', extended: true}));
app.use(body_parser.json({limit: '50mb'}));

// const test = true;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || [
                'http://localhost:5173',
                'http://52.50.179.63',
                'https://birminghambling.developyn.com'
            ].includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(origin, 'Not allowed by CORS.'));
    }
}));

app.get('/', (req, res) => {
    console.log('request recieved');
    return res.json({ message: `Hello World!` })
});

app.use(
    '/api/admin',
    require('./admin/index.js')(knex)
);

app.use(
    '/api/categories',
    require('./categories/index.js')(knex)
);

app.use(
    '/api/items',
    require('./items/index.js')(knex)
);

app.use(
    '/api/reserve',
    require('./reserve/index.js')(knex)
);

// if (test) 
app.listen(3000, () => console.log('Running on port 3000'));
// else module.exports = app;