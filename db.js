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
  async function injectLoanInfo(book, currentUserId) {
    var loanQuery =
      `SELECT * FROM loans WHERE book_id = '${book.id}' ` +
      `ORDER BY accept_date DESC LIMIT 1`;

    var mostRecentLoan = await pool.query(loanQuery).then(([rows, fields]) => {
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0];
    });

    var loanCountQuery = `SELECT COUNT (*) as "count" FROM loans WHERE book_id = '${book.id}'`;

    var loanCount = await pool.query(loanCountQuery).then(([rows, fields]) => {
      if (!rows || rows.length === 0) {
        return null;
      }
      return rows[0].count;
    });

    if (mostRecentLoan) {
      var owner = await users.getById(book.user_id, currentUserId);
      var requester = await users.getById(
        currentUserId,
        mostRecentLoan.requester_id
      );
      mostRecentLoan.owner = owner;
      mostRecentLoan.requester = requester;
    }

    book.loan_count = loanCount;
    book.loan = mostRecentLoan;
    return book;
  }

  return {
    getAll: async function (currentUserId, targetUserId) {
      let bookQuery;
      let bookInserts;
      if (currentUserId === targetUserId) {
        bookQuery = "SELECT * FROM books WHERE user_id = ?";
        bookInserts = [currentUserId];
      } else {
        bookQuery =
          "SELECT b.id, b.user_id, b.title, b.author, b.isbn, b.visibility, b.summary " +
          "FROM books b " +
          "JOIN friendships f ON f.user_id = b.user_id " +
          "WHERE b.user_id = ? AND f.friend_id = ? " +
          "AND (b.visibility = 'public' OR (b.visibility = 'friends' AND f.status = 'friends'))";
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
      }

      return Promise.resolve(retrievedBooks);
    },
    get: async function (bookId, injectLoanData = true, currentUserId) {
      var sql = "SELECT * FROM books WHERE id = ?";
      var inserts = [bookId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql).then(([rows, fields]) => {
        if (!rows || rows.length === 0) {
          return null;
        } else if (injectLoanData) {
          return injectLoanInfo(rows[0], currentUserId);
        } else {
          return rows[0];
        }
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
    getAll: function (currentId) {
      var sql =
        "SELECT users.id, name, status " +
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

    getFriendsofFriend: async function (friendId) {
      var friendData = await friends.getAll(friendId);

      var friendSize = friendData.length;

      for (var i = 0; i < friendSize; i++) {
        var targetFriend = friendData[i].id;
        //var friendOfFriend = await friends.getAll(targetFriend);

        var friendQuery =
          "SELECT u.id, u.name, f.status " +
          "FROM users u " +
          "JOIN friendships f ON (u.id = f.friend_id) " +
          "AND (f.user_id = ?) AND (users.id != ?)";

        var inserts = [targetFriend, friendId];
        friendQuery = mysql.format(friendQuery, inserts);

        var friendOfFriend = await pool
          .query(friendQuery)
          .then(([rows, fields]) => {
            return rows;
          });

        friendData[i].friend_of_friend = friendOfFriend;

        //friendData[i].friend_of_friend = friendOfFriend;
      }

      return friendData;
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
    getAllLoans: function (userId) {
      return loans.baseQuery(
        `WHERE (u.id = '${userId}') OR (requester_id = '${userId}')`
      );
    },
    getLoansByOwner: function (userId) {
      return loans.baseQuery(`WHERE u.id = '${userId}'`, userId);
    },
    getLoansByRequester: function (userId) {
      return loans.baseQuery(`WHERE l.requester_id = '${userId}'`, userId);
    },
    getLoanById: function (loanId) {
      return loans.baseQuery(`WHERE l.id = '${(loanId, 0)}'`);
    },

    baseQuery: async function (whereClause, userId) {
      var loanQuery =
        "SELECT l.id, l.requester_id, l.requester_contact, l.owner_contact, l.book_id, " +
        "l.request_date, l.accept_date, l.loan_start_date, l.loan_end_date, l.status " +
        "FROM loans l " +
        "JOIN books b ON l.book_id = b.id " +
        "JOIN users u on b.user_id = u.id " +
        whereClause;

      let loanData = await pool.query(loanQuery).then(([rows, fields]) => {
        return rows;
      });

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
    },

    getLoanStatus: async function (loanId) {
      var sql = "GET status FROM loans WHERE id = ?";
      sql = mysql.format(sql, loanId);

      return pool.query(sql);
    },

    updateLoanById: async function (loan) {
      var sql =
        "UPDATE loans SET requester_id = ?, book_id = ?, owner_contact = ?, " +
        "requester_contact = ?, request_date = ?, accept_date = ?, loan_start_date = ?, " +
        "loan_end_date = ?, return_date = ?, status = ? " +
        "WHERE id = ?";
      var inserts = [
        loan.requester_id,
        loan.book_id,
        loan.owner_contact,
        loan.requester_contact,
        loan.request_date,
        loan.accept_date,
        loan.loan_start_date,
        loan.loan_end_date,
        loan.return_date,
        loan.status,
        loan.id,
      ];
      sql = mysql.format(sql, inserts);

      var currentLoan = await loans.getLoanStatus(loan.id);

      if (currentLoan.status === "requested") {
        return null;
      } else {
        return pool.query(sql);
      }
    },

    deleteLoan: function (loanId) {
      var sql = "DELETE from loans WHERE id = ?";
      var inserts = [loanId];
      sql = mysql.format(sql, inserts);

      return pool.query(sql);
    },
  };
})();

var users = (function () {
  const userBaseQuery =
    "SELECT users.id, name, status " +
    "FROM users " +
    "LEFT JOIN friendships ON users.id = friendships.friend_id AND friendships.user_id = ? ";
  return {
    getUserByName: function (currentId, nameSearch) {
      var sql = userBaseQuery + "WHERE name LIKE ? LIMIT 20";
      var inserts = [currentId, `${nameSearch}%`];
      sql = mysql.format(sql, inserts);
      return pool.query(sql).then(([rows, fields]) => {
        return rows;
      });
    },
    getById: function (currentId, targetId) {
      var sql = userBaseQuery + "WHERE users.id = ?";
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
    delete: function (userId, currentUserId) {
      var sql = "DELETE FROM users WHERE id = ?";
      var inserts = [userId];
      sql = mysql.format(sql, inserts);

      if (userId === currentUserId) {
        return pool.query(sql);
      } else {
        return null;
      }
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
