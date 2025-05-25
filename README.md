# Movie API Service

## Requirements

-   Node.js
-   Docker (for DynamoDB Local)

## Setup

1. Run DynamoDB Local:

```bash
docker-compose up -d
```

2. Install dependencies:

```bash
npm install
```

3. Run the API:

```bash
npm start
```

4. Access GraphQL Playground:

```
http://localhost:4000/
```

## Available Operations

-   `popularMovies(limit: Int)`
-   `findMovie(id: ID!)`
-   `createMovie(input: MovieInput!)`
-   `updateMovie(id: ID!, input: MovieInput!)`
-   `deleteMovie(id: ID!)`
