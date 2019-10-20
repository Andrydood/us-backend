# us-backend
This is the backend for [It's Us!](http://itsus.app)

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
2. Create the server
    * Install the packages `yarn`.
    * Run the dev environment `yarn dev`.
3. Create a user
    * Post a request to `http://localhost:4000/user/create` with the body of `application/json` -
    ```
    {
      "email": "andrydood@itsus.com",
      "username": "andrydood",
      "password": "p455w0rd",
      "firstName": "Andrea",
      "lastName": "Casino",
      "bio": "My bio",
      "locationId": 1,
      "skillIds": [
        1
      ]
    }
    ```
    If this works you should get a response like
    ```
    {
      "id": "z-cz5f4Z"
    }
    ```
4. Go wild!

