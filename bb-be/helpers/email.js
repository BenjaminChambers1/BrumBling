const AWS = require('aws-sdk');

const SES = new AWS.SES({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'eu-west-1'
});

const send_email = async (email, HTML, subject) => {
    const params = {
        Destination: {
            ToAddresses: [
                email
            ]
        }, 
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8", 
                    Data: HTML
                }
            }, 
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        }, 
        Source: "birmingham.bling@gmail.com", 
    };

    await SES.sendEmail(params).promise();

    return 'Email sent';
};

module.exports = { send_email };