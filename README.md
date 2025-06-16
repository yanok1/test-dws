# Pokemon REST API (NestJS / TypeORM / SQLite)

## Overview

This project is a REST API for managing Pokemon records. It is built using NestJS, TypeORM, and SQLite (in-memory for tests). The API supports CRUD operations (create, read, update, delete) for Pokemon, as well as filtering, pagination, sorting, and an import endpoint that fetches Pokemon data from the [PokeAPI](https://pokeapi.co).

## Assumptions

- The project uses NestJS, TypeORM, and SQLite (with in-memory DB for tests).
- A TDD (Test-Driven Development) approach is adopted, with e2e tests (using supertest and Jest) covering endpoints.
- The Pokemon entity is linked to a Type entity via a many-to-many relationship (i.e. a Pokemon can have multiple types).
- The import endpoint (`POST /pokemons/import`) fetches Pokemon data (name and types) from the PokeAPI (e.g. https://pokeapi.co/api/v2/pokemon/158) and upserts the record (update if exists, create otherwise).

## Additional Instructions

- **Install Dependencies:**  
  Run `npm install` (or `yarn install`) to install all dependencies (including axios for the import endpoint).

- **Run Tests:**  
  Run `npm test` (or `npm run test:e2e`) to execute the e2e tests. (Note: In test mode, the database is in-memory.)

- **Run the Server:**  
  Run `npm run start:dev` (or `yarn start:dev`) to start the NestJS server in development mode.

- **Import a Pokemon:**  
  To import (or update) a Pokemon (for example, Totodile with id 158), send a POST request to `/pokemons/import` with a JSON body like:
  ```json
  { "id": 158 }
  ```
  The endpoint will fetch the Pokemon's name and types from the PokeAPI, upsert the record, and return the upserted Pokemon.

- **Environment:**  
  The project uses a `.env` file (integrated via `@nestjs/config`) for configuration (e.g. database path, port). Ensure that your environment variables (or a `.env` file) are set accordingly.

- **Docker:**  
  Docker and Docker Compose are set up for containerized development and testing. (Refer to the Dockerfile and docker-compose.yml for details.)

- **Linting & Formatting:**  
  The project uses a linter (e.g. ESLint) and formatter (e.g. Prettier) to enforce clean code. Run `npm run lint` (or `yarn lint`) to check for linting errors.

- **Bonus:**  
  The import endpoint (`POST /pokemons/import`) is a bonus feature that demonstrates integration with an external API (PokeAPI) and upserting records.