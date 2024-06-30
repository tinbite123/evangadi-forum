const mysql2 = require('mysql2');

const dbConnection = mysql2.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
        socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
        connectionLimit: 10
})


// console.log(process.env.PASSWORD);


// dbConnection.execute("select 'test' ", (err, result) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(result);
//     }
// })





module.exports = dbConnection.promise()
