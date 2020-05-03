# ParaLibrary API
The API for the ParaLibrary application\
All routes start with `https://paralibrary.digital/api`

## ---------- Books ---------- ##
### The Book object
```json
{
  "id": 123,
  "user_id": 123,
  "title": "A Book Title",
  "author": "An Author Name",
  "isbn": "1234567890123",
  "summary": "Can be very long",
  "visibility": "public",
  "categories": ["horror", "scifi"]
}
```
Visibility is an ENUM and can be referenced by string name ("public" | "private" | "friends")
### Routes
   Type | Route | Description 
  ---:| --- | --- 
`   GET`|` /books`     | Get all the books for the current user. Returns an array of book objects
`  POST`|` /books`     | Create a new book
`   GET`|` /books/:id` | Get a single book object by its id
`   PUT`|` /books/:id` | Modify a book object by its id
`DELETE`|` /books/:id` | Delete a book object by its id

## ---------- Users ---------- ##
### The User Object
```json
{
  "id": 123,
  "name": "Up to 255 chars"
}
```
### Routes
 Type | Route | Description 
 ---:| --- | --- 
`  POST`|`/users`     | Create a new user                       |   Requires full json object
`  GET` |`/users`     | Gets a user by his/her name             |   Requires "name" json data
`   GET`|`/users/:id` | Get the current user by his/her id      |   Does not need json data, only an id number in the URL
`   PUT`|`/users/:id` | Modify the user object by his/her id.   |   Requires "name" json data
`DELETE`|`/users/:id` | Delete the user object by his/her id    |   Does not need json data, only an id number in the URL

## ---------- Categories ---------- ##
### The Category Object
```json
{
  "id": 123,
  "user_id": 123,
  "name": "Up to 255 chars"
}
```
### Routes
 Type | Route | Description 
 ---:| --- | --- 
`   GET`|`/categories`     | Get all the categories for the current user
`  POST`|`/categories`     | Create a new category
`   GET`|`/categories/:id` | Get a single category object by its id
`   PUT`|`/categories/:id` | Modify a category object by its id
`DELETE`|`/categories/:id` | Delete a category object by its id

## ---------- Friends ---------- ##
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
status is an ENUM and can be referenced by string name ("requested" | "waiting" | "friends"). The API will always return the string version.
### Routes
 Type | Route | Description 
 ---:| --- | ---  
`   GET`|`/friends`        | Get all the friends for the current user (currently static data)
`   GET`|`/friends/:id`    | A temp route that serves real data by specifying a certain user in the url (gets said user's friends). 
`  POST`|`/friends/:id/`   | Depending on the status passed in, will request/accept/reject a friendship. 
                             
As a note to front end - to req/acc/rej a friendship using the POST request, one must pass in the status and the target user as a json object. 

One example of this is:
{
  "id": 1,
  "status": "requested"
}

Another would be:
{
  "id": 9001,
  "accepted"
}

And the last would be:
{
  "id": 42,
  "rejected"
}

## ---------- Loans ---------- ##
### The Loans Object
```json
{
  "id": 123,
  "owner": {
    "id": 123,
    "display_name": "Up to 255 chars",
    "name": "Up to 255 chars"
  },
  "requester": {
    "id": 123,
    "display_name": "Up to 255 chars",
    "name": "Up to 255 chars"
  },
  "book": {
    "id": 123,
    "user_id": 123,
    "title": "A Book Title",
    "author": "An Author Name",
    "isbn": "1234567890123",
    "summary": "Can be very long",
    "visibility": "public"
  },
  "request_date": "2020-04-16T15:38:49.000Z",
  "accept_date": "2020-04-16T15:38:49.000Z",
  "loan_start_date": "2020-04-16T15:38:49.000Z",
  "loan_end_date": "2020-04-16T15:38:49.000Z",
  "status": "pending"
}
```
The timestamps are return as strings\
status is an ENUM and can be referenced by number (0,1,2,3,4) or string name ("pending"|"accepted"|"loaned"|"returned"|"late"). The API always returns the string version.
### Routes
 Type | Route | Description 
 ---:| --- | --- 
`   GET`|`/loans`           | Get all loans where the user is the owner or requester
`  POST`|`/loans`           | Create a new loan
`   GET`|`/loans/owner`     | Get all the loans where the user is the owner
`   GET`|`/loans/requester` | Get all the loans where the user is the requester
`   GET`|`/loans/:id`       | Get a single loan by its id
`   PUT`|`/loans/:id`       | Modify a loan by its id
`DELETE`|`/loans/:id`       | Delete a loan by its id
