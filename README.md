# ParaLibrary API
The API for the ParaLibrary application\
All routes start with `https://paralibrary.digital/api`

## Books
### The Book object
```json
{
  "id": 123,
  "user_id": 123,
  "title": "A Book Title",
  "author": "An Author Name",
  "isbn": "1234567890123",
  "summary": "Can be very long",
  "visibility": false
}
```
### Routes
`   GET /books`     - Get all the books for the current user. Returns an array of book objects\
`  POST /books`     - Create a new book\
`   GET /books/:id` - Get a single book object by its id\
`   PUT /books/:id` - Modify a book object by its id\
`DELETE /books/:id` - Delete a book object by its id

## Users
### The User Object
```json
{
  "id": 123,
  "display_name": "Up to 255 chars",
  "name": "Up to 255 chars"
}
```
### Routes
`  POST /users` - Create a new user\
`   GET /users` - Get the current user's object\
`   PUT /users` - Modify the user's object\
`DELETE /users` - Delete the user's object

## Categories
### The Category Object
```json
{
  "id": 123,
  "user_id": 123,
  "name": "Up to 255 chars"
}
```
### Routes
`   GET /categories`     - Get all the categories for the current user\
`  POST /categories`     - Create a new category\
`   GET /categories/:id` - Get a single category object by its id\
`   PUT /categories/:id` - Modify a category object by its id\
`DELETE /categories/:id` - Delete a category object by its id

## Friends
### A Friend Object
```json
{
  "id": 123,
  "display_name": "Up to 255 chars",
  "name": "Up to 255 chars",
  "status": "requested"
}
```
A friend object is just a user object with an extra property "status" that tells the relationship of the friend to the user.\
status is an ENUM and can be referenced by number (0,1,2) or string name ("requested" | "waiting" | "friends"). The API will always return the string version.
### Routes
`   GET /friends`             - Get all the friends for the current user\
`  POST /friends/:id/request` - Request friendship with the target user\
`  POST /friends/:id/accept`  - Accept friendship request with the target user\
`   PUT /friends/:id`         - Modify a friendships object by its id.\
`DELETE /friends/:id`         - Delete a friendships object by its id

## Loans
### The Loans Object
```json
{
  "id": 123,
  "owner_id": 123,
  "requester_id": 123,
  "book_id": 123,
  "request_date": datetime,
  "accept_date": datetime,
  "loan_start_date": datetime,
  "loan_end_date": datetime,
  "status": "pending"
}
```
status is an ENUM and can be referenced by number (0,1,2,3,4) or string name ("pending"|"accepted"|"loaned"|"returned"|"late"). The API always returns the string version.
### Routes
`   GET /loans`           - Get all loans where the user is the owner or requester\
`  POST /loans`           - Create a new loan
`   GET /loans/owner`     - Get all the loans where the user is the owner\
`   GET /loans/requester` - Get all the loans where the user is the requester\
`   GET /loans/:id`       - Get a single loan by its id\
`   PUT /loans/:id`       - Modify a loan by its id\
`DELETE /loans/:id`       - Delete a loan by its id
