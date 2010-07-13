# nStore Session Store for Connect

This is a simple session store for [Connect][] that uses [nStore][] for persisting session data.  It implements the full Session Store interface and has built-in pruning of stale sessions on every nStore database compaction.

## Usage

Create a connect app, and use this as the session store.

    var Connect = require('connect'),
        nStoreSession = require('./lib/nstore-session');

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

## Options

You can pass options into the call to `new nStoreSession({})`.

 - **maxAge** - When the nStore database is compacted, any sessions last accessed more than `maxAge` ago (in ms) will be pruned. Defaults to 1 hour.
 - **dbFile** - Where to store the nStore database, defaults to "sessions.db" in the current directory.
 
[Connect]: http://extjs.github.com/Connect/
[nStore]: http://github.com/creationix/nstore