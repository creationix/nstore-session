
var Connect = require('connect'),
    nStoreSession = require('../lib/nstore-session');

// Set up a base app with some global filters
var App = module.exports = Connect.createServer(
  Connect.logger(),
  Connect.cookieDecoder(),
  Connect.session({store: new nStoreSession()}),
  Connect.router(function (app) {
    app.get("/", function (req, res) {
      res.simpleBody(200, req.session);
    });
  })
);

