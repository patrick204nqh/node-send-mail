const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();

// View engine setup
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'contact',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: 'patrick204nqh@gmail.com',
    subject: 'Testing',
    text: 'hello, world',
    html: output
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error Occurs', err)
    } else {
      console.log('Email Sent');
      res.render('contact');
    }
  })
});

app.listen(3000, () => console.log('Server started...'));