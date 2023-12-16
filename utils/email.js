const nodemailer = require('nodemailer');

const sendEmail = async options =>{

    // 1 - create a transporter 
    const transporter = nodemailer.createTransport({
        //service: 'Gmail', // activate in gmail "less secure app" option
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // 2 - Define email options 
    const mailOptions = {
        from: 'Mohamed Rezq <mohamed.sameh.10104@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3 - send the email 
    await transporter.sendMail(mailOptions);
    
};

module.exports = sendEmail;
