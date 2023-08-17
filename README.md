# curso-manguinho-backend

Curso de Clean Architecture em Node.js do Rodrigo Manguinho.

## Requirements

1. Node.js version `18.17.1` or higher
1. pnpm version `8.6.5` or higher
1. A PostgreSQL instance version `15.3` or higher
1. Environment variables setup - see below

## Environment Variables

- `DATABASE_URL`: The PostgreSQL instance URL. It's divided into 4 parts: `db_login` (the login to access the database), `db_password` (the password to access the database), `db_host` (the address to access the database) and `db_name` (the name of the database). Substitute those parts with your environment values.
- `PRISMA_HIDE_UPDATE_MESSAGE`: Defines if Prisma will show a message if any updates are available. The default value is `false`.
- `FASTIFY_LOGGER`: Defines if Fastify will show logging messages when the application is running. The default value is `false`.
- `PORT`: The port where your application will run. The default value is `3000`.
- `JWT_SECRET`: A secret word that will be used to encode your JSON Web Tokens. Make sure you use a long and strong secret, with a great diversity of letters, numbers and special characters.

## Setup

1. Create a `.env` file in the project root with your environment variables
1. Install the required packages with `pnpm install`
1. Build the code with `pnpm build`
1. Start the code with `pnpm start:dev`