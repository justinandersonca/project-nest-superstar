# Project Nest

This is a monorepo containing multiple related projects and packages.

## Structure

```
project-nest/
├── packages/           # Contains all the packages/projects
├── package.json       # Root package.json with workspace configuration
└── README.md         # This file
```

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build all packages:
   ```bash
   yarn build
   ```

3. Run tests:
   ```bash
   yarn test
   ```

## Available Scripts

- `yarn build` - Build all packages
- `yarn test` - Run tests across all packages
- `yarn lint` - Run linting across all packages

## Adding New Packages

To add a new package:

1. Create a new directory in the `packages/` folder
2. Initialize it with a `package.json`
3. Add your package code
4. The package will automatically be included in the workspace

## Development

Each package in the `packages/` directory can be developed independently while sharing common dependencies and configurations defined in the root `package.json`.

# Movie Showtimes API

A NestJS-based API for managing movie showtimes, theaters, and bookings.

## Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- Yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd project-nest
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development environment:
```bash
docker-compose up --build
```

This will:
- Start the PostgreSQL database
- Run database migrations
- Seed the database with sample data
- Start the API service in development mode

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api`

## Sample Users

The database is seeded with two sample users:

1. Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. Regular User
   - Email: user@example.com
   - Password: user123
   - Role: user

## Development

### Available Scripts

- `yarn workspace @project-nest/api start:dev` - Start the API in development mode
- `yarn workspace @project-nest/api build` - Build the API
- `yarn workspace @project-nest/api test` - Run tests
- `yarn workspace @project-nest/api migration:generate` - Generate a new migration
- `yarn workspace @project-nest/api migration:run` - Run pending migrations
- `yarn workspace @project-nest/api seed` - Seed the database

### Environment Variables

The following environment variables can be configured in `.env.development`:

- `PORT` - API port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRATION` - JWT token expiration
- `LOG_LEVEL` - Logging level
- `CORS_ORIGIN` - CORS allowed origin
- `RATE_LIMIT_TTL` - Rate limiting time window
- `RATE_LIMIT_LIMIT` - Rate limiting max requests

## API Documentation

The API documentation is available through Swagger UI at `http://localhost:3000/api`. It includes:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Example values
- Interactive testing interface

## Authentication

The API uses JWT-based authentication. To authenticate requests:

1. Login using the `/auth/login` endpoint
2. Include the received JWT token in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Database

The application uses PostgreSQL as its database. The database is automatically created and seeded when starting the development environment.

To manually seed the database:
```bash
docker-compose exec api yarn workspace @project-nest/api seed
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests: `yarn workspace @project-nest/api test`
4. Submit a pull request

## License

This project is licensed under the MIT License. 