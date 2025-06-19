# Movie API Service

A Node.js backend service providing a GraphQL API for movie data, using DynamoDB for storage.

## Features
- Query popular movies
- Fetch detailed movie info by ID
- Create and update movies
- Data stored in DynamoDB (local)

## Setup

### 1. Install dependencies
```
pnpm install
```


### 2. Start DynamoDB Local using Docker
```
docker run -p 8000:8000 amazon/dynamodb-local
```

Or do it through Docker Compose
```
docker-compose up -d
```

This will start DynamoDB Local in the background on port 8000.

### 3. Start the GraphQL server
```
pnpm run dev
```

The server will be available at http://localhost:4000

## DynamoDB Table
The Movies table is created automatically on server start.

## Example GraphQL Queries

### Query popular movies
```graphql
query {
  popularMovies(limit: 5) {
    id
    title
    popularity
  }
}
```

### Query a movie by ID
```graphql
query {
  movie(id: "MOVIE_ID") {
    id
    title
    description
    releaseDate
    popularity
  }
}
```

### Create a new movie
```graphql
mutation {
  createMovie(input: {
    title: "Inception"
    description: "A mind-bending thriller."
    releaseDate: "2010-07-16"
    popularity: 9.8
  }) {
    id
    title
  }
}
```

### Update a movie
```graphql
mutation {
  updateMovie(id: "MOVIE_ID", input: {
    popularity: 10.0
  }) {
    id
    title
    popularity
  }
}
```

## Notes
- Uses Apollo Server 3 and AWS SDK v2
- DynamoDB Local runs in-memory and resets on restart
- Focused on core functionality for the take-home challenge 

