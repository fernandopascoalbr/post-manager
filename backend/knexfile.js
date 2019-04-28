// Update with your config settings.

//criando com knex init no cmd
//migrations -> knex migrate:create 'nomedatabela'

const {db, tableName} = require('./.env')

module.exports = {

  client: 'postgresql',
    connection: db,
    pool: {
      min: 2,
      max: 10
    },
    migrations: tableName

};
