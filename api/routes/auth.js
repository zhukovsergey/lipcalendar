const express = require("express");
const router = express.Router();
const {Nuxt, Builder} = require('nuxt');
const app = express();
const bodyParser = require("body-parser");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { param } = require("./service");
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(express.json());
app.use(cookieParser());

app.use(
    jwt({
        secret: process.env.TOKEN,
        algorithms: ["HS256"],
    }).unless({
        path: '/api/auth/login'
    })
)
router.post("/login",  async (req, res) => { 
    if (
        req.body.user ===process.env.AUTH_USER &&
        req.body.password === process.env.AUTH_PASSWORD
    ) {   
    await jsonwebtoken.sign({ user: req.body.user}, process.env.TOKEN, async function(err, token) {
    await res.json({token: token, user: req.body.user});
     });
  } else {
      await res.status(403).json({ message: 'Ошибка авторизации' });
  }
  });
  router.post("/logout",  async (req, res) => {    
     
});

router.get('/user', async (req, res) => {
    const razdelit = req.headers.authorization.split('Bearer ')[1]
   const token = jsonwebtoken.decode(razdelit);
   res.json({user: token.user});

});

module.exports = router ;

 