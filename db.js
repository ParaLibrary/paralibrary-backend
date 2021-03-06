var mysql = require("mysql2");
var config = require("./config/db");
var moment = require("moment");

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
  async function injectLoanInfo(book, currentUserId) {
    return new Promise((resolve, reject) => {
      if (book.user_id == currentUserId) {
        // For user's own library, get the most recent loan for the book
        return resolve(getRecentLoan(book));
      } else {
        // For another's library, get the user's loan for the book, if it exists
        return resolve(getCurrentUserLoan(book));
      }
    }).then(async (loan) => {
      if (loan) {
        var owner = await users.getById(currentUserId, book.user_id);
        var requester = await users.getById(currentUserId, loan.requester_id);
        loan.owner = owner;
        loan.requester = requester;
      }

      book.loan_count = await getLoanCount(book.id);
      book.loan = loan;

      return book;
    });
  }

  function getLoanCount(bookId) {
    let loanCountQuery = `SELECT COUNT(*) as "count" FROM loans WHERE book_id = '${bookId}'`;
    return pool.query(loanCountQuery).then(([rows, fields]) => {
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0].count;
    });
  }

  function getRecentLoan(book) {
    let loanQuery =
      `SELECT ${loans.loanColumns()} FROM loans WHERE book_id = '${book.id}' ` +
      `ORDER BY accept_date DESC LIMIT 1`;

    // Get most recent loan
    return pool.query(loanQuery).then(([rows, fields]) => {
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0];
    });
  }

  function getCurrentUserLoan(book) {
    let loanQuery =
      `SELECT ${loans.loanColumns()} FROM loans WHERE book_id = '${book.id}' ` +
      `ORDER BY accept_date DESC LIMIT 1`;

    // Get most recent loan
    return pool.query(loanQuery).then(([rows, fields]) => {
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0];
    });
  }

  function injectCategories(book) {
    return pool
      .query(
        mysql.format(
          "SELECT c.name FROM categories c JOIN books_categories bc ON c.id = bc.category_id JOIN books b ON b.id = bc.book_id WHERE b.id = ?",
          [book.id]
        )
      )
      .then(([rows, fields]) => {
        book.categories = rows.map((row) => row.name);
      })
      .then(() => {
        return book;
      });
  }

  return {
    bookColumns: () =>
      "CAST(books.id AS CHAR(50)) as id, CAST(books.user_id AS CHAR(50)) as user_id, books.title, books.author, books.isbn, books.visibility, books.summary",

    getAll: async function (currentUserId, targetUserId) {
      let bookQuery;
      let bookInserts;
      if (currentUserId === targetUserId) {
        bookQuery = `SELECT ${this.bookColumns()} FROM books WHERE user_id = ?`;
        bookInserts = [currentUserId];
      } else {
        bookQuery =
          `SELECT DISTINCT ${this.bookColumns()} ` +
          "FROM books " +
          "JOIN friendships ON books.user_id = friendships.friend_id " +
          "WHERE books.user_id = ? " +
          "AND (books.visibility = 'public' " +
          "OR (books.visibility = 'friends' AND friendships.status = 'friends' AND friendships.user_id = ? AND friendships.friend_id = books.user_id))";
        bookInserts = [targetUserId, currentUserId];
      }

      bookQuery = mysql.format(bookQuery, bookInserts);

      let retrievedBooks = await pool
        .query(bookQuery)
        .then(([rows, fields]) => {
          return rows;
        });
      if (!retrievedBooks) {
        return Promise.resolve([]);
      }

      for (var i = 0; i < retrievedBooks.length; i++) {
        retrievedBooks[i] = await injectLoanInfo(
          retrievedBooks[i],
          currentUserId
        );
        retrievedBooks[i] = await injectCategories(retrievedBooks[i]);
      }

      return Promise.resolve(retrievedBooks);
    },
    get: async function (bookId, needLoanData = true, currentUserId) {
      var sql = `SELECT ${this.bookColumns()} FROM books WHERE id = ?`;
      var inserts = [bookId];
      sql = mysql.format(sql, inserts);

      return pool
        .query(sql)
        .then(([rows, fields]) => {
          if (!rows || rows.length === 0) {
            return null;
          }
          return injectCategories(rows[0]);
        })
        .then((book) => {
          if (book && needLoanData) {
            return injectLoanInfo(book, currentUserId);
          }
          return book;
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

      return pool.query(sql).then(([result, fields]) => {
        if (result.affectedRows === 0) {
          return null;
        }
        book.id = result.insertId;
        return categories.syncBook(book).then(() => {
          return result.insertId;
        });
      });
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

      return pool.query(sql).then(([result, fields]) => {
        return categories.syncBook(book);
      });
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
    syncBook: async function (book) {
      if (!book.categories || book.categories.length === 0) {
        return Promise.resolve();
      }

      let newCats = book.categories.map((c) => c.toLowerCase());
      let oldCats = await books
        .get(book.id)
        .then((book) => book.categories.map((c) => c.toLowerCase()));
      let deleteCats = oldCats.filter((cat) => !newCats.includes(cat));

      // Delete old cats asynchronously
      if (deleteCats.length > 0) {
        categories.removeUnusedCats(book);
      }

      // Add new cats
      return categories.insertCategories(book, newCats);
    },
    insertCategories: function (book, categories) {
      // Insert into the categories table
      return (
        pool
          .query(
            mysql.format(
              "INSERT IGNORE INTO categories (user_id, name) VALUES ?",
              [categories.map((cat) => [book.user_id, cat])]
            )
          )
          // Get the id of the categories
          .then(() => {
            return pool.query(
              mysql.format(
                "SELECT id FROM categories c WHERE user_id = ? AND name IN (?)",
                [book.user_id, categories]
              )
            );
          })
          // Link the categories to the book
          .then(([rows, fields]) => {
            return pool
              .query(
                mysql.format(
                  "INSERT IGNORE INTO books_categories (book_id, category_id) VALUES ?",
                  [rows.map((row) => [book.id, row.id])]
                )
              )
              .then(([result, fields]) => result);
          })
      );
    },
    removeUnusedCats: async function (book) {
      let newCats = book.categories;
      let oldCats = await books.get(book.id).then((book) => book.categories);
      let deleteCats = oldCats.filter((cat) => !newCats.includes(cat));
      if (deleteCats.length > 0) {
        return (
          pool
            .query(
              mysql.format(
                "DELETE bc FROM books_categories bc JOIN categories c ON c.id = bc.category_id WHERE book_id = ? AND user_id = ? AND c.name IN (?)",
                [book.id, book.user_id, deleteCats]
              )
            )
            // Delete unused categories
            .then(() => {
              pool.query(
                "DELETE FROM categories WHERE id NOT IN (SELECT category_id FROM books_categories)"
              );
            })
            .catch((error) => console.error(error))
        );
      }
      return Promise.resolve();
    },
  };
})();

var friends = (function () {
  return {
    getAll: function (currentId) {
      var sql =
        `SELECT ${users.userColumns()} ` +
        "FROM users " +
        "JOIN friendships ON users.id = friendships.friend_id AND friendships.user_id = ? ";
      var inserts = [currentId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },

    get: function (friendId) {
      var sql =
        `SELECT ${users.userColumns()} ` +
        "FROM friendships JOIN users " +
        "ON friend_id = id " +
        "WHERE user_id = ?";
      var inserts = [friendId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },

    getSecondaryFriends: function (currentUserId) {
      // Status is guaranteed to be null because that indicates the two users have no relation
      return pool
        .query(
          mysql.format(
            "SELECT DISTINCT CAST(u.id AS CHAR(50)) as id, u.name, null as status, u.picture, u.email " +
              "FROM friendships a " +
              "JOIN friendships b ON a.friend_id = b.user_id " +
              "JOIN users u ON u.id = b.friend_id " +
              "WHERE a.user_id = ? " +
              "AND b.friend_id <> a.user_id " +
              "AND a.status = 'friends' " +
              "AND b.status = 'friends' " +
              "AND NOT EXISTS (SELECT * FROM friendships WHERE user_id = a.user_id AND friend_id = u.id) " +
              "LIMIT 10",
            [currentUserId]
          )
        )
        .then(([rows, fields]) => {
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
  };
})();

var libraries = (function () {
  return {
    getLibrary: async function (currentUserId, targetUserId) {
      let libUser = await users.getById(currentUserId, targetUserId);
      let libBooks = await books.getAll(currentUserId, targetUserId);

      return { user: libUser, books: libBooks };
    },
  };
})();

var loans = (function () {
  return {
    loanColumns: () =>
      "CAST(loans.id AS CHAR(50)) as id, loans.requester_id, CAST(loans.book_id AS CHAR(50)) as book_id, loans.request_date, loans.accept_date, loans.loan_start_date, loans.loan_end_date, loans.status",

    getAllLoans: function (userId) {
      return loans.baseQuery(
        `WHERE (users.id = '${userId}') OR (loans.requester_id = '${userId}')`
      );
    },
    getLoansByOwner: function (userId) {
      return loans.baseQuery(`WHERE users.id = '${userId}'`, userId);
    },
    getLoansByRequester: function (userId) {
      return loans.baseQuery(`WHERE loans.requester_id = '${userId}'`, userId);
    },
    getLoanById: function (loanId, userId) {
      return loans
        .baseQuery(`WHERE loans.id = '${loanId}'`, userId)
        .then((rows) => {
          if (rows.length === 0) {
            return null;
          }
          return rows[0];
        });
    },

    baseQuery: async function (whereClause, userId) {
      var loanQuery =
        `SELECT ${this.loanColumns()} ` +
        "FROM loans " +
        "JOIN books ON loans.book_id = books.id " +
        "JOIN users on books.user_id = users.id " +
        whereClause;

      return pool
        .query(loanQuery)
        .then(([rows, fields]) => {
          return rows;
        })
        .then(async (loanData) => {
          var loanSize = loanData.length;
          for (var i = 0; i < loanSize; i++) {
            var bookId = loanData[i].book_id;
            var bookData = await books.get(bookId, false, userId);
            var bookOwner = bookData.user_id;

            var userData = await users.getById(bookOwner, bookOwner);
            var requesterOwner = loanData[i].requester_id;

            var requesterData = await users.getById(bookOwner, requesterOwner);

            loanData[i].book = bookData;
            loanData[i].owner = userData;
            loanData[i].requester = requesterData;
          }
          return loanData;
        });
    },

    insert: async function (loan) {
      var getStatusQuery = `SELECT COUNT (*) as "count" FROM loans WHERE requester_id = ? AND book_id = ?`;
      var statusInserts = [loan.requester_id, loan.book_id];
      getStatusQuery = mysql.format(getStatusQuery, statusInserts);

      let loanCheck = await pool
        .query(getStatusQuery)
        .then(([rows, fields]) => {
          return rows;
        });

      if (loanCheck[0].count >= 1) {
        // The count will always return a row, so if count === 0,
        // then no row exists with the same requester_id and book_id.
        return Promise.reject();
      } else {
        getEmailQuery = `SELECT email FROM users WHERE id = ${loan.requester_id}`;
        var emailCheck = await pool
          .query(getEmailQuery)
          .then(([rows, fields]) => {
            return rows[0];
          });

        if (!emailCheck.email) {
          return Promise.reject();
        } else {
          var insertQuery =
            "INSERT INTO loans (book_id, requester_id, status) " +
            "VALUES (?,?,?)";
          var insertParams = [loan.book_id, loan.requester_id, loan.status];
          insertQuery = mysql.format(insertQuery, insertParams);
          return pool.query(insertQuery);
        }
      }
    },

    updateLoanById: async function (loan) {
      let currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
      let updateQuery = `UPDATE loans SET status = '${loan.status}', `;

      switch (loan.status) {
        case "loaned":
          updateQuery += `loan_start_date = '${currentDate}' WHERE id = ${loan.id}`;
          break;
        case "returned":
          updateQuery += `return_date = '${currentDate}' WHERE id = ${loan.id}`;
          break;
        case "accepted":
          updateQuery += `accept_date = '${currentDate}' WHERE id = ${loan.id}`;
          break;
        default:
          console.log("Invalid status");
          return Promise.reject();
      }

      return pool.query(updateQuery).then((updateResult) => {
        if (loan.status === "accepted") {
          let deleteQuery = `DELETE FROM loans WHERE status = 'pending' AND book_id = ${loan.book_id} `;
          pool.query(deleteQuery);
        }
        return updateResult;
      });
    },

    deleteLoan: function (loanId) {
      var sql = "DELETE FROM loans WHERE id = ?";
      var inserts = [loanId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
  };
})();

var users = (function () {
  return {
    userColumns: () =>
      "CAST(users.id AS CHAR(50)) as id, users.name, friendships.status, users.picture, users.email ",
    userBaseQuery: () =>
      `SELECT ${users.userColumns()} ` +
      "FROM users " +
      "LEFT JOIN friendships ON users.id = friendships.friend_id AND friendships.user_id = ? ",
    getUserByName: function (currentId, nameSearch) {
      var sql = this.userBaseQuery() + "WHERE name LIKE ? LIMIT 20";
      var inserts = [currentId, `${nameSearch}%`];
      sql = mysql.format(sql, inserts);
      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },
    getById: function (currentId, targetId) {
      var sql = this.userBaseQuery() + "WHERE users.id = ?";
      var inserts = [currentId, targetId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        }
        return rows[0];
      });
    },
    getByGoogleId: function (googleId) {
      // This query is only used internally, so the formatting of the columns doesn't matter
      var sql = `SELECT CAST(users.id AS CHAR(50)) as id, users.name, null as status, users.picture, users.email FROM users WHERE google_id = ?`;
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
      var sql =
        "INSERT INTO users (name, google_id, picture, email) VALUES (?,?,?,?)";
      var inserts = [user.name, user.google_id, user.picture, user.email];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
    update: function (user) {
      var sql =
        "UPDATE users SET name = ?, picture = ?, email = ? WHERE id = ?";
      var inserts = [user.name, user.picture, user.email, user.id];
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
  loans,
  users,
};
