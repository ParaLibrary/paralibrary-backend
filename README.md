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
`GET /books` - Get all the books for the current user\
`POST /books` - Create a new book\
`GET /books/:id` - Get a single book object by its id\
`PUT /books/:id`- Modify a book object by its id\
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
`GET /users/:id` - Get a single users object by its id\
`PUT /users/:id`- Modify a users object by its id\
`DELETE /users/:id` - Delete a users object by its id

## Categories
### The Categories Object
```json
{
  "id": 123,
  "user_id": 123,
  "name": "Up to 255 chars"
}
```
### Routes
`GET /categories` - Get all the categories for the current user\
`POST /categories` - Create a new categories\
`GET /categories/:id` - Get a single categories object by its id\
`PUT /categories/:id`- Modify a categories object by its id\
`DELETE /categories/:id` - Delete a categories object by its id

## Friendships
### The Friendships Object
```json
{
  "friend_a": 123,
  "friend_b": 123,
  "status": ("requested" | "waiting" | "friends")
}
```
status is an ENUM and can be referenced by number (0,1,2) or string name.
### Routes
`GET /friendships` - Get all the friendships for the current user\
`POST /friendships` - Create a new friendship\
`GET /friendships/:id` - Get a single friendships object by its id\
`PUT /friendships/:id`- Modify a friendships object by its id\
`DELETE /friendships/:id` - Delete a friendships object by its id

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
  "status": ("pending"|"accepted"|"loaned"|"returned"|"late")
}
```
status is an ENUM and can be referenced by number (0,1,2,3,4) or string name.
### Routes
`GET /loans` - Get all loans where the user is the owner or requester\
`POST /loans` - Create a new loan
`GET /loans/owner` - Get all the loans where the user is the owner\
`GET /loans/requester` - Get all the loans where the user is the requester\
`GET /loans/:id` - Get a single loans object by its id\
`PUT /loans/:id`- Modify a loans object by its id\
`DELETE /loans/:id` - Delete a loans object by its id

