const { Pool } = require('pg')


//Reemplazar con variables de ambiente
//const pool = new Pool();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
}