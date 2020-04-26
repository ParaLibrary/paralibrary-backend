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
    get: function (bookId) {
      return pool.query("SELECT * FROM books WHERE id = ?", [bookId])
        .then(([rows, fields]) => {
          if (!rows || rows.length === 0) {
            return null;
          }
          return rows[0];
        });
    },
    insert: function (book) {
      return pool.query(
        "INSERT INTO books (user_id, title, author, isbn, summary, visibility) VALUES (?,?,?,?,?,?)",
        [book.user_id, book.title, book.author, book.isbn, book.summary, book.visibility] 
      );
    },
    update: function (book) {
      return pool.query(
        "UPDATE books SET user_id = ?, title = ?, author = ?, isbn = ?, summary = ?, visibility = ? WHERE id = ?",
        [book.user_id, book.title, book.author, book.isbn, book.summary, book.visibility, book.id]
      );
    },
    delete: function (bookId) {
      return pool.query("DELETE FROM books WHERE id = ?", [bookId]);
    },
  }; 
})();

var categories = (function () {
  return {
    get: function (categoryId) {
      return pool.query("SELECT * FROM categories WHERE id = ?", [categoryId])
        .then(([rows, fields]) => {
          if (!rows || rows.length === 0) {
            return null;
          }
          return rows[0];
        });
    },
    getAllByUserId: function (category) {
      return pool.query("SELECT * FROM categories WHERE user_id = ?", [category.user_id])
        .then(([rows, fields]) => {
          if (!rows || rows.length === 0) {
            return null;
          }
          return rows[0];
        });
    },
    insert: function (category) {
      return pool.query(
        "INSERT INTO categories (user_id, name) VALUES (?,?)",
        [category.user_id, category.name] 
      );
    },
    update: function (category) {
      return pool.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [category.name, category.id]
      );
    },
    delete: function (categoryId) {
      return pool.query("DELETE FROM categories WHERE id = ?", [categoryId]);
    },
  };
})();


var friends = (function () {
  return {
    get: function (friendId) {
      return pool.query(
        "SELECT friend_id, status, display_name, name " + 
        "FROM friendships JOIN users " +
        "ON friend_id = id " +
        "WHERE user_id = ?",
        [friendId])

        .then(([rows, fields]) => {
          return rows;
        }
      );
    },
    updateStatus: function(friend){
      return pool.query(
        "UPDATE friendships SET status = ? WHERE friend_id = ?",
        [friend.status, friend.id]
      );
    },
    createWaitingRow: function(friend){
      // If the user requests a friendship, a 'waiting' row must also be created.
    },
    updateStatusToAcc: function(friend){
      return pool.query(
        "UPDATE friendships SET status = ? WHERE friend_id = ?",
        [friend.status, friend.id]
        
      );
    },
    updateStatusToRej: function(friendId){
      return pool.query(
        "UPDATE friendships SET status = ? WHERE friend_id = ?",
        ["rejected", friendId]

        
      );
    },
    deleteOnUsersEnd: function (friendId) {
      return pool.query("DELETE FROM friendships WHERE user_id = ?", [friendId]);
    },
    deleteFriendsEnd: function (friendId) {
      return pool.query("DELETE FROM friendships WHERE friend_id = ?", [friendId]);
    },
  };
})();

var users = (function () {
  return {
    get: function (userId) {
      return pool
        .query("SELECT * FROM users WHERE id = ?", [userId])
        .then(([rows, fields]) => {
          if (!rows || rows.length === 0) {
            return null;
          }
          return rows[0];
        });
    },
    insert: function (user) {
      return pool.query(
        "INSERT INTO users (display_name, name) VALUES (?,?)",
        [user.display_name, user.name]
      );
    },
    update: function(user){
      return pool.query(
        "UPDATE users SET display_name = ?, name = ? WHERE id = ?",
        [user.display_name, user.name, user.id]
      );
    },
    delete: function (userId) {
      return pool.query("DELETE FROM users WHERE id = ?", [userId]);
    },
  };
})();

module.exports = {
  books,
  categories,
  friends,
  users,
};
