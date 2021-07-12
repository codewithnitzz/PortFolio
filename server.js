const express = require('express');
require('dotenv').config();
const server = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// To fetch the information of body of html we use BodyParser.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); // AFter fetching we converting in json object

app.use(express.static('public')); // use for displaying the html file

// Rendering the html template
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});

// When You press the submit button in Contact Form.
app.post('/fillform', (req, res) => {
    const output = `
    <p><b> New Contact request from Form <b></p>
    <h3> Details are : </h3>
    <ul>
    <li> Name: ${req.body.name} </li>
    <li> Email: ${req.body.email} </li>
    <li> Subject: ${req.body.subject} </li>
    </ul>
    <h3>Message</h3>
   <p> ${req.body.message} </p> `;

    let transporter = nodemailer.createTransport({      // Passing the contact form details to the mail.
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'nitzzygo@gmail.com',
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"NodeMailer Contact" <nitzzygo@gmail.com>',
        to: 'nitzzygo@gmail.com',
        subject: 'Node Contact Request',
        text: "I would like to get in touch with you",
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
      console.log('Message sent: %s', info.messageId);
      console.log(info.response);
    })
    res.sendFile(__dirname + "/" + "public/thanks.html");
});


// Starting the server.
app.listen(server, () => {
    console.log(`listening on server ${server}.`);
})