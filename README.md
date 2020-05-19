# ParaLibrary API

The API for the ParaLibrary application\
All routes start with `http://paralibrary.digital/api`\
Any requests except the Authentication requests must include credentials and have a valid session. Otherwise, the server will respond with a `403`.

---

### Table of Contents

- [Authentication](#authentication)
- [Libraries](#libraries)
- [Books](#books)
- [Users](#users)
- [Friends](#friends)
- [Loans](#loans)
- [Categories](#categories)

---

# Authentication

|   Type | Route          | Description                    |
| -----: | -------------- | ------------------------------ |
| `POST` | `/auth/login`  | Start an authenticated session |
| `POST` | `/auth/logout` | Destroy the current session    |

## `POST /login`

### Fetch Format

```json
{
  "tokenid": "..."
}
```

### Response

After authenticating, the server will respond with status `200` and the following JSON object, indicating the user, whether a new user was created or not, and how long the session lasts. If authentication fails, the server will respond with status `401`.

```json
{
  "userid": "123",
  "new": false,
  "maxAge": "123"
}
```

## `POST /logout`

### Fetch Format

None

### Response

The server will respond with status `200` upon successful logout and status `401` if the session no longer exists.

# Libraries

### Library Object

```json
{
  "user": {
    "user object": "See User Object"
  },
  "books": [
    {
      "book object": "See Book Object"
    },
    {
      "book object": "See Book Object"
    }
  ]
}
```

### Routes

|  Type | Route            | Description                    |
| ----: | ---------------- | ------------------------------ |
| `GET` | `/libraries`     | Get the current user's library |
| `GET` | `/libraries/:id` | Get the library for user :id   |

## `GET /libraries`

### Fetch Format

None

### Response

On success, returns status `200` and a **Library Object**. On failure, returns status `404`. It will return all books owned by the user, regardless of book status.

## `GET /libraries/:id`

### Fetch Format

None

### Response

On success, returns status `200` and a **Library Object**. If the current user is friends with the :id user, it will include all books with visibility "public" and "friends". If they are not friends, it will only return "public" books.

# Books

### Book Object

Visibility can be one of ("public" | "private" | "friends").\
The property `loan` will be the loan with the most recent `request_date`. The **Loan Object** here will not include the book property to avoid infinite recursion.

```json
{
  "id": "123",
  "user_id": "123",
  "title": "A Book Title",
  "author": "An Author Name",
  "isbn": "1234567890123",
  "summary": "Can be very long",
  "visibility": "public",
  "loan_count": "123",
  "loan": {
    "loan object": "See Loan Object (without the book property)"
  }
}
```

### Routes

|     Type | Route        | Description                        |
| -------: | ------------ | ---------------------------------- |
|   `POST` | `/books`     | Create a new book                  |
|    `GET` | `/books/:id` | Get a single book object by its id |
|    `PUT` | `/books/:id` | Modify a book object by its id     |
| `DELETE` | `/books/:id` | Delete a book object by its id     |

## `POST /books`

### Fetch Format

Expects a partial **Book Object** as JSON in the body of the request. See below for the fields. The visibility will be public if not specified.

```json
{
  "user_id": "123",
  "title": "A Book Title",
  "author": "An Author Name (optional)",
  "isbn": "1234567890123 (optional)",
  "summary": "Can be very long (optional)",
  "visibility": "public"
}
```

### Response

On success, returns status `200` and following JSON with the id of the inserted book. If the required fields are not supplied, returns status `400`. If the book was not inserted to the db for any other reason, returns a `404` and no JSON.

```json
{
  "id": "123"
}
```

## `GET /books/:id`

### Fetch Format

None

### Response

On success, returns status `200` and a single **Book Object** matching the :id. If no matching book exists, returns status `404`.

## `PUT /books/:id`

### Fetch Format

Expects a full **Book Object** in the body of the request. The book record in the db will be updated to match the given book object.

### Response

On success, returns status `200`. If the book does not exist, returns status `404`.

## `DELETE /books/:id`

### Fetch Format

None

### Response

On success, responds with status `200`. On failure, responds with status `404`.

# Users

### User Object

Status is one of (null | "requested" | "waiting" | "friends")\
Status will be null if the :id user is either the current user or they have no relation to the current user at all.

```json
{
  "id": "123",
  "name": "Up to 255 chars",
  "status": "friends"
}
```

### Routes

|     Type | Route                 | Description                                |
| -------: | --------------------- | ------------------------------------------ |
|    `GET` | `/users`              | Get the current user's object by id        |
| `DELETE` | `/users`              | Delete the current user by id              |
|    `GET` | `/users/:id`          | Get user object by id                      |
|    `PUT` | `/users/:id`          | Modify the user object by id               |
|    `GET` | `/users/search/:name` | Get list of users matching the name string |

## `GET /users/:id`

### Fetch Format

None

### Response

On Success, returns status `200` and a **User Object**. If the user does not exist, returns `404`. If the :id parameter is not a number, returns `400`.

## `PUT /users/:id`

### Fetch Format

Expects a partial **User Object** in the body of the request. `status` property is ignored.

### Response

On success, responds with status `200` and the db record will be updated to match the given object. At this time, only the name is malleable. If the user is not found, returns status `404`.

## `DELETE /users/:id`

### Fetch Format

None

### Response

On Success, responds with status `200`. On failure, responds with status `404`.

## `GET /users/search/:name`

### Fetch Format

None

### Response

On success, returns status `200` and a JSON array of **User Objects** matching `'name%'`. Limit is 20 results

```json
[
  { "user object": "See User Object" },
  { "user object": "See User Object" },
  { "user object": "See User Object" }
]
```

# Friends

### Routes

|   Type | Route                | Description                                                                                       |
| -----: | -------------------- | ------------------------------------------------------------------------------------------------- |
|  `GET` | `/friends`           | Returns the current user's friends and people who have requested friendship with the current user |
|  `GET` | `/friends/requested` | Returns friends the current user has requested friendship with, but they haven't responded        |
| `POST` | `/friends/:id`       | Set the friendship status from the current user to the target user                                |

## `GET /friends`

### Fetch Format

None

### Response

On success, returns a JSON object containing an array of **User Objects**.

```json
[
  { "user object": "See User Object" },
  { "user object": "See User Object" },
  { "user object": "See User Object" }
]
```

## `GET /friends/requested`

### Fetch Format

None

### Response

On success, returns status `200` and JSON array of **User Objects**. Format will be the same as the `GET /friends` route.

## `POST /friends/:id`

### Fetch Format

The body of the request must contain a JSON object with the id of the target user a selected action. Action can be one of ("request" | "accept" | "reject").\
To request friendship with user 123,

```json
{
  "id": "123",
  "action": "request"
}
```

To accept friendship with user 9001,

```json
{
  "id": "9001",
  "action": "accept"
}
```

To reject friendship with user 9001,

```json
{
  "id": "9001",
  "action": "reject"
}
```

### Response

On success, return status `200`. If the id in the URL does not match the id in the JSON or no action is provided, return `400`. On other failure, return status `404`.

# Loans

### Loan Object

The timestamps are return as strings\
Status can be one of ("pending" | "accepted" | "loaned" | "returned" | "canceled" | "declined")

```json
{
  "id": "123",
  "owner": {
    "user object": "See User Object"
  },
  "owner_contact": "name@domain.com",
  "requester": {
    "user object": "See User Object"
  },
  "requester_contact": "name@domain.com",
  "book": {
    "book object": "See Book Object (but without the loan property)"
  },
  "request_date": "2020-04-16T15:38:49.000Z",
  "accept_date": "2020-04-16T15:38:49.000Z",
  "loan_start_date": "2020-04-16T15:38:49.000Z",
  "loan_end_date": "2020-04-16T15:38:49.000Z",
  "status": "pending"
}
```

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

## `GET /loans`

### Fetch Format

None

### Response

On success, returns status `200` and an array of **Loan Objects**. On failure, return a `404`.

```json
[
  { "loan object": "See Loan Object" },
  { "loan object": "See Loan Object" },
  { "loan object": "See Loan Object" }
]
```

## `POST /loans`

### Fetch Format

Expects a **Loan Object** (without id property) in the body of the request.

### Response

On success, responds with status `200`. On failure, responds with status `404`.

## `GET /loans/owner`

### Fetch Format

None

### Response

Same as `GET /loans` route

## `GET /loans/requester`

### Fetch Format

None

### Response

Same as `GET /loans` route

## `GET /loans/:id`

### Fetch Format

None

### Response

On success, returns status `200` and a single **Loan Object** matching the :id. On failure, returns status `404`.

## `PUT /loans/:id`

### Fetch Format

Expects a full **Loan Object** in the body of the request.

### Response

On success, responds with status `200` and the db record will be updated to match the given object. If the loan is not found, returns status `404`.

## `DELETE /loans/:id`

### Fetch Format

None

### Response

On success, returns status `200` and deletes the loan record from the db. On failure, returns status `404`.

# Categories

### Category Object

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
