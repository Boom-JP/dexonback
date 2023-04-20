const mysql = require('mysql');

//create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'exam',
    timezone: '+7:00',
    port: 8889
})

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('MySQL Database is connected successfully')
    }
});

module.exports = connection;