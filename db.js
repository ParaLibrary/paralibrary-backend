var mysql = require("mysql2");
var config = require("./config/db");

var pool = mysql
  .createPool({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    connectionLimit: 5,
  })
  .promise();

pool
  .query("SELECT 1+1")
  .then(() => {
    console.log("Connected to db");
  })
  .catch((e) => {
    console.error("Can't establish connection to the database\n" + e);
  });

var books = (function () {
  return {
    getBookById: function (bookId) {
      var sql = "SELECT * FROM books WHERE id = ?";
      var inserts = [bookId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    insert: function (book) {
      var sql =
        "INSERT INTO books (user_id, title, author, isbn, summary, visibility) VALUES (?,?,?,?,?,?)";
      var inserts = [
        book.user_id,
        book.title,
        book.author,
        book.isbn,
        book.summary,
        book.visibility,
      ];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    update: function (book) {
      var sql =
        "UPDATE books SET user_id = ?, title = ?, author = ?, isbn = ?, summary = ?, visibility = ? WHERE id = ?";
      var inserts = [
        book.user_id,
        book.title,
        book.author,
        book.isbn,
        book.summary,
        book.visibility,
        book.id,
      ];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    delete: function (bookId) {
      var sql = "DELETE from books WHERE id = ?";
      var inserts = [bookId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
  };
})();

var categories = (function () {
  return {
    get: function (categoryId) {
      var sql = "SELECT * FROM categories WHERE id = ?";
      var inserts = [categoryId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    getAllByUserId: function (category) {
      var sql = "SELECT * FROM categories WHERE id = ?";
      var inserts = [category.user_id];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    insert: function (category) {
      var sql = "INSERT INTO categories (user_id, name) VALUES (?,?)";
      var inserts = [[category.user_id, category.name]];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    update: function (category) {
      var sql = "UPDATE categories SET name = ? WHERE id = ?";
      var inserts = [category.name, category.id];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    delete: function (categoryId) {
      var sql = "DELETE FROM categories WHERE id = ?";
      var inserts = [categoryId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
  };
})();

var friends = (function () {
  return {
    get: function (friendId) {
      var sql =
        "SELECT friend_id, status, name " +
        "FROM friendships JOIN users " +
        "ON friend_id = id " +
        "WHERE user_id = ?";
      var inserts = [friendId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },
    update: async function (userId, friendId, userStatus, friendStatus) {
      const insertUpdate =
        "INSERT INTO friendships VALUES (?,?,?) ON DUPLICATE KEY UPDATE status = VALUES(status)";
      return executeTransaction([
        mysql.format(insertUpdate, [userId, friendId, userStatus]),
        mysql.format(insertUpdate, [friendId, userId, friendStatus]),
      ]);
    },
    delete: function (userId, friendId) {
      // Will delete the requestee's row
      const deleteStatement =
        "DELETE FROM friendships WHERE user_id = ? AND friend_id = ?";
      return executeTransaction([
        mysql.format(deleteStatement, [userId, friendId]),
        mysql.format(deleteStatement, [friendId, userId]),
      ]);
    },

    // Quick note: We can tighten up these functions once we get sessions going, since sessions will provide us with
    // both the target user's id, and the sender's id. One sql query can be made with those each time instead of two.
  };
})();

var libraries = (function () {
  return {
    getLibrary: async function (users) {
      if (users.user_id === users.target_id) {
        var userQuery = "SELECT * FROM users WHERE id = ?";
        var inserts = [users.user_id];
        userQuery = mysql.format(userQuery, inserts);

        // TODO: Add in categories field to book query.
        var bookQuery = "SELECT * FROM books WHERE user_id = ?";
        var inserts = [users.user_id];
        bookQuery = mysql.format(bookQuery, inserts);

        let user = await pool.query(userQuery).then(([rows, fields]) => {
          return rows;
        });

        let books = await pool.query(bookQuery).then(([rows, fields]) => {
          return rows;
        });

        for (var i = 0; i < books.length; i++) {
          var data = books[i].id;

          var loanQuery =
            `SELECT * FROM loans WHERE book_id = '${data}' ` +
            `ORDER BY accept_date DESC LIMIT 1`;

          var loans = await pool.query(loanQuery).then(([rows, fields]) => {
            if (!rows || rows.length === 0) {
              return null;
            }
            return rows[0];
          });

          var loanCountQuery = `SELECT COUNT (*) as "count" FROM loans WHERE book_id = '${data}'`;

          var loanCount = await pool
            .query(loanCountQuery)
            .then(([rows, fields]) => {
              if (!rows || rows.length === 0) {
                return null;
              }
              return rows[0].count;
            });

          books[i].loan_count = loanCount;
          books[i].loan = loans;
        }
        return { user, books };
      } else if (users.user_id != users.target_id) {
        var userQuery = "SELECT * FROM users WHERE id = ?";
        var inserts = [users.user_id];
        userQuery = mysql.format(userQuery, inserts);

        // TODO: Add in categories field to book query.
        var bookQuery =
          "SELECT * FROM books WHERE user_id = ? AND visibility = 'public'";
        var inserts = [users.user_id];
        bookQuery = mysql.format(bookQuery, inserts);

        let user = await pool.query(userQuery).then(([rows, fields]) => {
          return rows;
        });

        let books = await pool.query(bookQuery).then(([rows, fields]) => {
          return rows;
        });

        for (var i = 0; i < books.length; i++) {
          var data = books[i].id;

          var loanQuery =
            `SELECT * FROM loans WHERE book_id = '${data}' ` +
            `ORDER BY accept_date DESC LIMIT 1`;

          var loans = await pool.query(loanQuery).then(([rows, fields]) => {
            if (!rows || rows.length === 0) {
              return null;
            }
            return rows[0];
          });

          var loanCountQuery = `SELECT COUNT (*) as "count" FROM loans WHERE book_id = '${data}'`;

          var loanCount = await pool
            .query(loanCountQuery)
            .then(([rows, fields]) => {
              if (!rows || rows.length === 0) {
                return null;
              }
              return rows[0].count;
            });

          books[i].loan_count = loanCount;
          books[i].loan = loans;
        }
        return { user, books };
      }
    },
  };
})();

var users = (function () {
  return {
    getUserByName: function (userName) {
      var sql = `SELECT * FROM users WHERE name LIKE '${userName}%'`;

      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },
    getUserById: function (userId) {
      var sql = "SELECT * FROM users WHERE id = ?";
      var inserts = [userId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    getByGoogleId: function (googleId) {
      var sql = "SELECT * FROM users WHERE google_id = ?";
      var inserts = [googleId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    insert: function (user) {
      var sql = "INSERT INTO users (name, google_id) VALUES (?,?)";
      var inserts = [user.name, user.google_id];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    update: function (user) {
      var sql = "UPDATE users SET name = ? WHERE id = ?";
      var inserts = [user.name, user.id];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    delete: function (userId) {
      var sql = "DELETE FROM users WHERE id = ?";
      var inserts = [userId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
  };
})();

/**
 * Executes the array of queries in a transaction to ensure they all happen or none at all
 *
 * @param {String[]} queries - An array of queries to execute
 * @returns {Promise}
 */
async function executeTransaction(queries) {
  let connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");
    const queryPromises = [];

    queries.forEach((query) => {
      queryPromises.push(connection.query(query));
    });
    const results = await Promise.all(queryPromises);

    await connection.commit();
    await connection.release();
    return results;
  } catch (error) {
    await connection.query("ROLLBACK");
    await connection.release();
    return Promise.reject(err);
  }
}

module.exports = {
  pool,
  books,
  categories,
  friends,
  libraries,
  users,
};
