# Robodev API

This API was generated by Robodev.

Follow the instructions below to get started.

## 1. Setup environment

```bash
# Use the version of Node.js specified in the .nvmrc file
nvm use

# Enable corepack if not already enabled
corepack enable
```

## 2. Setup the project

```bash
# Install the project dependencies
yarn

# Generate local config template
yarn bootstrap

# Startup the containers
docker-compose up -d
```

## 3. Databse Migrations

[Prisma Migration Overview](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/overview)

```bash

# Run migrations and build the Prisma client
yarn prisma migrate dev

# Build just the Prisma client
yarn prisma generate

```

## 4. Running the app

```bash
yarn build

# Start the application in watch mode for development
yarn start:dev
```

## 5. Test

```bash
# Run end-to-end or unit tests
yarn test:e2e
yarn test:unit-test

# Generate test coverage report
yarn test:unit-test:coverage
yarn test:e2e:coverage
```

## Develop

```bash
# Lint and fix the project files
yarn lint:fix
```

## Admin

Admin Panel can be accessed at route [/admin](http://localhost:3001/admin)

There is a default admin user created with the following credentials:

Email: <b>admin@example.com</b><br>
Password: <b>password</b>

## Swagger

Swagger API documentation can be accessed at route [/docs](http://localhost:3001/docs)

## Additional module documentation

- [Architecture](./docs/codebase/02_Architecture.md)
- [Configuration](./docs/codebase/04_Config.md)
- [Vendors](./docs/codebase/03_Vendors.md)
- [Observability](./docs/codebase/05_Observability.md)
- [REST API](./docs/codebase/06_REST.md)
- [Authentication](./src/modules/authn/docs/README.md)
- [OpenTelemetry](./src/common/logging/otel/README.md)
- [Media Provider S3](./src/vendors/media-provider-s3/docs/README.md)
- [Notification Provider with Firebase Cloud Messaging](./src/vendors/push-notification-provider-fcm/docs/README.md)
- [Sentry](./src/vendors/email-provider-sendgrid/docs/README.md)
