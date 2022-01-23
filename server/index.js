const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { app, server } = require('./app');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

async function start () {

  const nuxt = new Nuxt(config);
  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  };

  app.use(nuxt.render);

  server.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${ host }:${ port }`,
      badge: true,
    });
  })
};
start();

