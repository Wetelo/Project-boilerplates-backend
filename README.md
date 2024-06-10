![image](https://github.com/Wetelo/Project-boilerplates-backend/blob/develop/logo.jpg?raw=true)

## About

NestJS REST API boilerplate for a typical project

A fully compatible frontend boilerplate: https://github.com/Wetelo/Project-boilerplates-frontend-web-2

A fully compatible admin panel boilerplate: https://github.com/Wetelo/Project-boilerplates-admin

## Technologies

Nest framework, TypeORM, PostgreSQL, PgAdmin, Docker

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Before start application
Directory logs should be created in root folder.
Directory uploads/public should be created in root folder for file uploading.

Docker (only for database) can be run with the following command
```bash
#run docker
$ docker compose up -d --build

#stop docker
$ docker compose down
```
Seeds can be run with the next command
```bash
$ npm run seed
```

## Migrations
Create a migration
```bash
$ npm run typeorm:generate-migration --name=migration_name
```
Run a migration
```bash
$ npm run typeorm:run-migrations
```
