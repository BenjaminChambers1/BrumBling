let knex;
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const image_upload = async (file, file_name) => {
    const file_content = await fs.readFile(file.path);

    const params = {
        Bucket: process.env.BUCKET,
        Key: file_name || file.originalname,
        Body: file_content,
        ContentType: file.mimetype
    };

    const upload_to_s3 = await s3.putObject(params).promise()
        .catch(console.log);

    if (!upload_to_s3) return null;

    await fs.unlink(file.path, () => console.info(`Deleted ${file.path}`))
        .catch(console.log);

    const url = `https://${process.env.BUCKET}.s3.eu-west-1.amazonaws.com/${params.Key}`;

    return url || null;
};

const create_item = async (req, res) => {
    const {
        body: {
            name,
            description,
            category_id,
            price,
            stock
        },
        file
    } = req;
    let file_name;
    let image_url = null;
    if (file) {
        file_name = `public/items/${Number(new Date())}-${file.filename}.${file.mimetype.split('/')[1]}`;
    
        image_url = await image_upload(
            file,
            file_name
        ).catch(console.log);
    }

    const [ item ] = await knex(process.env.DB_ITEMS)
        .insert({
            name,
            description,
            image_url,
            category_id,
            price: price || 0,
            stock: stock || 0
        })
        .returning('*')
        .catch(err => [console.log(err)]);

    if (!item) return res.json({
        message: 'Error creating item in database'
    });

    return res.json(item);
}

const edit_item = async (req, res) => {
    const {
        body: {
            id,
            name,
            description,
            image_url,
            category_id,
            price,
            stock
        },
        file
    } = req;

    let file_name;
    let new_image_url = null;

    if (file) {
        file_name = `public/items/${Number(new Date())}-${file.filename}.${file.mimetype.split('/')[1]}`;
    
        image_url = await image_upload(
            file,
            file_name
        ).catch(console.log);
    }

    const edited_item = await knex(process.env.DB_ITEMS)
        .where({ id })
        .update({
            name,
            description,
            image_url: image_url || new_image_url,
            category_id,
            price,
            stock
        })
        .catch(err => [console.log(err)]);

    if (!edited_item) return res.json({
        message: 'Error creating item'
    });

    return res.json({
        message: 'Successfully edited item'
    });
}

const delete_item = async (req, res) => {
    const { id } = req.body;
    
    const deleted = await knex(process.env.DB_ITEMS)
        .where({ id })
        .del()
        .catch(err => [console.log(err)]);

    if (!deleted) return res.json({
        message: 'Error deleting item'
    });

    return res.json({
        message: 'Deleted item'
    });
}

module.exports = db => {
    knex = db;
    return {
        create_item,
        edit_item,
        delete_item
    }
}