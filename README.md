# us-backend
This is the backend for [It's Us!](http://github.com/andrydood/us-frontend)

It is an express API connecting to a postgres DB which allows for user management, post management, and has a websocket/chat function.

### Getting Started
In order to get this backend up and running you will need to follow these instructions:

1. Create the Database
    * A Postgres server running on your machine.
For mac users the easiest option is to download the [postgres.app](https://postgresapp.com/downloads.html).
    * Start the Postgres server.
    * In a terminal run `psql` to enter the cli.
    * Create a database `CREATE DATABASE usbackend;`.
    * Connect to your database `\c usbackend;`
    * Exit the database `\q;`.
    * Go to the the `/db` folder of repo where there is the script `setup.sql`. Run the command `psql -d usbackend -a -f setup.sql`.
2. Add the relevant config in `config/default.json`
3. Create the server
    * Install the packages `yarn`.
    * Run the dev environment `yarn dev`.
4. Go wild!

### Deployment

```
docker build . -t us-backend
docker run -p 4000:4000 us-backend
```
