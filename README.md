# ParaLibrary API

The API for the ParaLibrary application\
All routes start with `https://paralibrary.digital/api`

## ---------- Library ----------

### The Library object

```json
{
  "user": {
    "id": 123,
    "display_name": "Up to 255 chars",
    "name": "Up to 255 chars",
    "status": "friends"
  },
  "books": [
    {
      "id": 123,
      "user_id": 123,
      "title": "A Book Title",
      "author": "An Author Name",
      "isbn": "1234567890123",
      "summary": "Can be very long",
      "visibility": "public",
      "categories": ["horror", "scifi"],
      "loan": {
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
        "request_date": "2020-04-16T15:38:49.000Z",
        "accept_date": "2020-04-16T15:38:49.000Z",
        "loan_start_date": "2020-04-16T15:38:49.000Z",
        "loan_end_date": "2020-04-16T15:38:49.000Z",
        "status": "pending"
      }
    },
    {
      "id": 124,
      "user_id": 123,
      "title": "A Book Title 2",
      "author": "An Author Name 2",
      "isbn": "9876543210",
      "summary": "Is a summary",
      "visibility": "private",
      "categories": ["horror", "scifi"],
      "loan": {
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
        "request_date": "2020-04-16T15:38:49.000Z",
        "accept_date": "2020-04-16T15:38:49.000Z",
        "loan_start_date": "2020-04-16T15:38:49.000Z",
        "loan_end_date": "2020-04-16T15:38:49.000Z",
        "status": "loaned"
      }
    }
  ]
}
```

Book visibility is an ENUM and can be referenced by string name ("public" | "private" | "friends")\
Loan status is an ENUM and can be referenced by string name ("pending" | "accepted" | "loaned" | "returned" | "late")\
Loan will be the active (accepted or loaned) loan or null

### Routes

|  Type | Route            | Description                     |
| ----: | ---------------- | ------------------------------- |
| `GET` | `/libraries`     | Get the current user's library  |
| `GET` | `/libraries/:id` | Get the library for the user id |

## ---------- Users ----------

### The User Object

```json
{
  "id": 123,
  "display_name": "Up to 255 chars",
  "name": "Up to 255 chars"
}
```

### Routes

|     Type | Route        | Description                           |
| -------: | ------------ | ------------------------------------- |
|   `POST` | `/users`     | Create a new user                     |
|    `GET` | `/users/:id` | Get the current user by his/her id    |
|    `PUT` | `/users/:id` | Modify the user object by his/her id  |
| `DELETE` | `/users/:id` | Delete the user oobject by his/her id |

## ---------- Categories ----------

### The Category Object

```json
{
  "id": 123,
  "user_id": 123,
  "name": "Up to 255 chars"
}
```

### Routes

|     Type | Route             | Description                                 |
| -------: | ----------------- | ------------------------------------------- |
|    `GET` | `/categories`     | Get all the categories for the current user |
|   `POST` | `/categories`     | Create a new category                       |
|    `GET` | `/categories/:id` | Get a single category object by its id      |
|    `PUT` | `/categories/:id` | Modify a category object by its id          |
| `DELETE` | `/categories/:id` | Delete a category object by its id          |

## ---------- Friends ----------

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

|   Type | Route           | Description                                                                                            |
| -----: | --------------- | ------------------------------------------------------------------------------------------------------ |
|  `GET` | `/friends`      | Get all the friends for the current user (currently static data)                                       |
|  `GET` | `/friends/:id`  | A temp route that serves real data by specifying a certain user in the url (gets said user's friends). |
| `POST` | `/friends/:id/` | Depending on the status passed in, will request/accept/reject a friendship.                            |

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

## ---------- Loans ----------

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

|     Type | Route              | Description                                            |
| -------: | ------------------ | ------------------------------------------------------ |
|    `GET` | `/loans`           | Get all loans where the user is the owner or requester |
|   `POST` | `/loans`           | Create a new loan                                      |
|    `GET` | `/loans/owner`     | Get all the loans where the user is the owner          |
|    `GET` | `/loans/requester` | Get all the loans where the user is the requester      |
|    `GET` | `/loans/:id`       | Get a single loan by its id                            |
|    `PUT` | `/loans/:id`       | Modify a loan by its id                                |
| `DELETE` | `/loans/:id`       | Delete a loan by its id                                |
