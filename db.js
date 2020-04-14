var mysql = require('mysql2');
var config = require('./config/db');

var pool = mysql.createPool({
  host     : config.host,
  port     : config.port,
  user     : config.username,
  password : config.password,
  database : config.database,
  connectionLimit: 5
}).promise();

pool.query('SELECT 1+1')
.then(() => {
  console.log('Connected to db');
})
.catch((e) => {
  console.error('Can\'t establish connection to the database\n' + e);
})

var books = (function() {
  return {
    get: function(bookId) {
      return pool.query('SELECT * FROM book WHERE id = ?', [ bookId ])
      .then(([rows, fields]) => {
        if(!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      })
    },
    delete: function(bookId) {
      return pool.query('DELETE FROM book WHERE id = ?', [ bookId ]);
    }
  }
})();

module.exports = {
  books
}