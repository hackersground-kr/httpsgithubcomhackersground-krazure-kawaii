const knex = require('knex')
require("dotenv").config();

const db = knex({
  client: 'mysql',
  connection: {
    host : process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    ssl: {
      rejectUnauthorized: false
    }
  }
})

module.exports = db;