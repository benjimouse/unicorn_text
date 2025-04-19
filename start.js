const moduleAlias = require('module-alias');

// Tell module-alias where the real package.json is
moduleAlias.addAliases({
  config: __dirname + '/src/config',
  services: __dirname + '/src/services',
  routes: __dirname + '/src/routes',
  middlewares: __dirname + '/src/middlewares',
});

require('./src/server.js');