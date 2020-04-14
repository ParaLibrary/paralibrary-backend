# ParaLibrary API
The API for the ParaLibrary application. All routes start with `https://paralibrary.digital/api`

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
`POST /books` - Create a new book\
`GET /books/:id` - Get a single book object by its id\
`PUT /books/:id`- Modify a book object by its id\
`DELETE /books/:id` - Delete a book object by its id\