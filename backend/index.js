require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

const { generateToken, validateToken } = require('./token');

const User = require('./models/User');
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(
  express.json({
    limit: '5mb',
  })
); // Specifies maximum size of the image tried to be saved

(async function connect() {
  await mongoose.connect(process.env.MONGO_DB);
})().catch((error) => console.log(error));

require('./projects')(app); // Calls for the module in projects.js

// Registration functionality
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) return res.json({ success: false, message: 'Please enter email and password.' }); // Checks if there's any value inside the input fields

  // RegExp for what letters and numbers you can use
  const emailRE = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );

  // Checks if email is valid
  if (!emailRE.test(email)) return res.json({ success: false, message: 'Email is not valid.' });

  // Checks if email exists in database
  const exists = await User.find({ email });
  if (exists.length) return res.json({ success: false, message: 'User already exists.' });

  // Checks if password is valid
  if (password.length < 8) return res.json({ success: false, message: 'Password needs to be at least 8 characters.' });

  // Encrypts your password for security
  const hashed = await bcrypt.hash(password, 10);

  // Grabs entered email and password and registrates it
  const newUser = new User({ email: email, password: hashed });
  await newUser.save();

  // Sends message back if registration is successfull
  const token = generateToken(email);
  res.json({ success: true, token, message: 'Successfully registered a new user.' });
});

// Login
// Checks if credentials match with requirements for login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const [user] = await User.find({ email }); // If there aren't any value it returns a message
  if (!user) return res.json({ success: false, message: 'E-mail and/or password does not match.' });

  const match = await bcrypt.compare(password, user.password); // If email and password match it logs in or it gives you a message stating that they don't match
  if (match) {
    const token = generateToken(email);
    return res.json({ success: true, token, message: 'Successfully logged in.' }); // => session id
  } else {
    return res.json({ success: false, message: 'E-mail and/or password does not match.' });
  }
});

app.get('/auth/validate', validateToken, (req, res) => {
  const { user } = res.locals;
  res.json({ success: true, user, message: 'Token is valid.' });
});

app.listen(port, () => {
  console.log('Server running on port:', port);
});
