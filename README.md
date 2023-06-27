# Arithmetic Calculator REST API

Implement a Web platform to provide a simple calculator functionality (addition, subtraction,
multiplication, division, square root, and a random string generation) where each functionality will
have a separate cost per request.

User’s will have a starting credit/balance. Each request will be deducted from the user’s balance.
If the user’s balance isn’t enough to cover the request cost, the request shall be denied.

This Web application and its UI application should be live (on any platform of your choice). They
should be ready to be configured and used locally for any other developer (having all instructions
written for this purpose).

### Local setup

- Required node version: v18.16 or higher
- Run `npm install`
- Copy the file `.env.example` and rename it to `.env`
- Define the required environment variables `DATABASE_URL` and `REDIS_URL`.
- *By using docker compose, run: `docker-compose up -d` to easily setup the required services.*
- Generate the required database client files by running: `npm run migration:generate`
- Apply the migration to your local database by running: `npm run migration:check`
- Run the server in development mode using the command `npm run dev:http`

### Serverless

Wrap the api using serverless by following the next steps:

- Install Serverless Framework by `npm install -g serverless serverless-offline`.
- Run the server locally using the command `serverless offline` to test the endpoints.
- Setup your AWS credentials, reference: https://www.serverless.com/framework/docs/providers/aws/guide/deploying.
- Build, pack and deploy the server by running `npm run serverless:deploy`.

#### Environment variables

Take a look at `.env.example` for details

#### Commands

- `npm run dev:http`: Starts the api, port: `3001` by default.
- `npm run build`: Create a production ready build.
- `npm run test`: Run test coverage
- `npm run serverless:deploy` Create a serverless deployment on AWS, `dev` stage is default, you can modify the details modifying the `serverless.yml` file.

