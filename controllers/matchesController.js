var Matches = require('../models/matches');
var bodyParser = require('body-parser');

module.exports = app => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  // returns all matches
  app.get('/api/matches', (req, res) => {
    Matches.find((error, matches) => {
      if (error) {
        res.status(501).send({ error });
      }
      res.send(matches);
    });
  });

  // returns single match by _id
  app.get('/api/match/:id', (req, res) => {
    Matches.findById(req.params.id, (error, match) => {
      res.send(match);
    });
  });

  // creates match
  app.post('/api/match', (req, res) => {
    var newMatch = Matches(req.body);
    newMatch.save((error, match) => {
      error ? res.status(501).send({ error }) : res.send(match);
    });
  });

  // updates match
  app.put('/api/match/:id', (req, res) => {
    Matches.findByIdAndUpdate(req.params.id, req.body, (error, match) => {
      error ? res.status(501).send({ error }) : res.send(match);
    });
  });

  //deletes match
  app.delete('/api/match/:id', (req, res) => {
    Matches.findByIdAndRemove(req.params.id, error => {
      error
        ? res.status(501).send({ error })
        : res.send({ message: 'Deleted' + req.params.id });
    });
  });
};
