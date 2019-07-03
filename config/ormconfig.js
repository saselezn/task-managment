const config = require('config');

const dbOptions = {
  type: 'postgres',
  host: config.get('connections.db.host'),
  port: config.get('connections.db.port'),
  username: config.get('connections.db.user'),
  password: config.get('connections.db.password'),
  database: config.get('connections.db.database'),
};

module.exports = [
  {
    ...dbOptions,
    entities: ['build/src/models/*.js'],
    migrationsTableName: 'orm_migrations',
    migrations: ['build/migrations/*.js'],
    logging: false,
    cli: {
      migrationsDir: 'build/migrations',
    },
  },
];
