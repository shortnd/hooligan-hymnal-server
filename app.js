const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); 
const OktaJwtVerifier = require('@okta/jwt-verifier')

const songController = require('./controllers/songController');
const playerController = require('./controllers/playerController');
const notificationController = require('./controllers/notificationController');
const pushTokenController = require('./controllers/pushTokenController');

const port = process.env.PORT || 3000;
let MONGO_URI = process.env.MONGO_URI;

const oktaJwtVerifier = new OktaJwtVerifier({
    clientId: '0oaf8qugaeLG9fBrk0h7',
    issuer: 'https://dev-141740.oktapreview.com/oauth2/default'
})

app.use('/assets', express.static(__dirname + '/public'));
app.use(cors());

// verify JWT token middleware
app.use((req, res, next) => {
    // require every request to have an authorization header
    if (!req.headers.authorization) {
      return next(new Error('Authorization header is required'))
    }
    let parts = req.headers.authorization.trim().split(' ')
    let accessToken = parts.pop()
    oktaJwtVerifier.verifyAccessToken(accessToken)
      .then(jwt => {
        req.user = {
          uid: jwt.claims.uid,
          email: jwt.claims.sub
        }
        next()
      })
      .catch(next) // jwt did not verify!
  })

app.set('view engine', 'ejs');

mongoose.connect(MONGO_URI, { useMongoClient: true });

songController(app);
playerController(app);
notificationController(app);
pushTokenController(app);

app.listen(port, () => {
    console.log('app listening on ' + port);
});
