## RestTest

## Overview

CRUD API with users and products where a user can have many products and a product can belong to several users

Entity routes:

| Operation  | URL                    | Method | Inputs       |
|------------|------------------------|--------|--------------|
| getUsers   | /user                  | GET    | none         |
| getUser    | /user/{id}             | GET    | [id]         |
| deleteUser | /user/{id}             | DELETE | [id]         |
| updateUser | /user/{id}?name={name} | PATCH  | [id], [name] |
| createUser | /user?name={name}      | POST   | [name]       |

Relation routes: 
| Operation             | URL                                        | Method | Inputs                             |
|-----------------------|--------------------------------------------|--------|------------------------------------|
| addProductToUser      | /user/{user_id}/{product_id}               | POST   | [user_id], [product_id]            |
| removeProductFromUser | /user/{user_id}/{product_id}?limit={limit} | DELETE | [user_id], [products_id], [limit] |
| getUserProducts       | /user/{user_id}/products                   | GET    | [user_id]                          |


## Requirements

* Node
* Git
* Docker

## Setup

### Clone the repo and install the dependencies.

```bash
git clone https://github.com/ClaudioGoncalvesLck/restTest.git
cd restTest
```

```bash
npm install
```

### Run the server

```bash
nodemon server.js
```

### Setup docker

```bash
docker compose up -d
```

Open [http://localhost:12345](http://localhost:3000) for pgAdmin.

Email: test@example.com

Password: admin

#### Connect to db

Add new server

Hostname: db

Port: 5432

Username: postgres

### Run migrations

```bash
npx knex migrate:latest
```

### Seed
Creates 10.000 fake users and products
```bash
npx knex seed:run
```


