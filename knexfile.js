// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://postgres:docker@localhost:5432/z_prefix'
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {'postgres://legsqufnpqgpqm:3e22c16eb68c3f2f331c1b7ee93ab9138ebebd39004b42a2d0e5e453de4d8878@ec2-34-231-63-30.compute-1.amazonaws.com:5432/d6p9jm15ciuj0q',
      ssl: { rejectUnauthorized: false },
     },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
