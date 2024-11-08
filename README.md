# Configuration and Setup Instructions

## 1. Postgres Configuration

Please change the Postgres user and password according to your database setup in the `Dockerfile`.

## 2. Email Configuration

Please add your email and password to the `price.service.ts` file to enable email functionality.

Make sure your email account has permission enabled to send emails from an unauthorized service. 

You can enable this by following the instructions in this [StackOverflow article](https://stackoverflow.com/questions/73365098/how-to-turn-on-less-secure-app-access-on-google#:~:text=As%20of%20May%2030%202022,as%20it%20no%20longer%20exists.&text=Enable%202fa%20on%20your%20google,true%20password%20in%20your%20code).

## 3. Run Docker

To build and start the Docker containers, run the following command:

```bash
$ docker-compose up --build

# If you encounter permission issues, try running the command with sudo:

$ sudo docker-compose up --build
```

## 4. Access Swagger API Documentation

Once the Docker containers are running, you can access the Swagger API documentation at:

```bash
$ http://localhost:3000/api
```