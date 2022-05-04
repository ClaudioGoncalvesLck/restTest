## RestTest

## Overview

CRUD API with users and products where a user can have many products and a product can belong to several users

Example:

| Operation  | URL                    | Method | Inputs       |
|------------|------------------------|--------|--------------|
| getUsers   | /user                  | GET    | none         |
| getUser    | /user/{id}             | GET    | [id]         |
| deleteUser | /user/{id}             | DELETE | [id]         |
| updateUser | /user/{id}?name={name} | PATCH  | [id], [name] |
| createUser | /user?name={name}      | POST   | [name]       |

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
cd docker/
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
cd ../db/
npx knex migrate:latest
```


