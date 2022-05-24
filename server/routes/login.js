const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secret = process.env.POLLY_SECRET || "secret";
const cPassword = process.env.POLLY_PASSWORD || "chilo";

const issuer = "polly proxy";
const option = {
  expiresIn: "7d",
};

router.post('/', function(req, res, next) {
  const {user_id, password} = req.body;
  if (password === cPassword) {
    const token = jwt.sign({
      iss: issuer,
      sub: user_id,
    }, secret, option);
    res.cookie('session_cookie', token, {
      secure: false,
      httpOnly: false,
    });
    res.send('OK');
  } else {
    res.status(401).send('unauthorized');
  }
});

function check(req, res, next) {
  console.log('check called');

  // check token
  try {
    if (req.token) {
      const decoded = jwt.verify(req.token, secret, {
        algorithms: ['HS256'],
        issuer,
      });
      if (req.body.Text) {
        next();
      } else {
        res.send('authorized');
      }
      return;
    }
  } catch (err) {
    console.log(err);
  }
  res.status(401).send('unauthorized');
}

module.exports = {
  loginRouter: router,
  check,
};