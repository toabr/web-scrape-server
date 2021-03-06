import mysql from 'mysql';

// DB connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

db.connect(err => {
    if (err) throw err;
    console.log('Mysql connected');
});

export default db;