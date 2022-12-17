const { Pool } = require('pg');

const database = process.env.DATABASE || 'heroe3'
const password = process.env.PASSWORD || '00000000'
const user = process.env.USER || 'postgres'
const host = process.env.HOST || 'localhost'
const port = process.env.PORTT || '5432'
const max = process.env.MAX || 20

const db = new Pool({
    database: database,
    password: password,
    user: user,
    host: host,
    port: port,
    max: max,
})

module.exports = {
    db
}