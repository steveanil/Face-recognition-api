// Express is a light-weight web application framework to help organise web app on the server side 
const express = require('express');

const bcrypt = require('bcrypt-nodejs');

//enables CORS
const cors = require('cors');

// Knex is an SQL query builder
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
});

// const db = knex ({
//     client: 'pg',
//     connection: {
//       host : 'postgresql-solid-20564', //localhost (home)
//       user : 'postgres',
//       password : '',
//       database : 'smart-brain'  //database name
//     }
//   });

// To run express
const app = express(); 

//body parser(middleware) - when sending json data we need to parse it cuz express doesnt know how to parse it
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => { res.send('it is working!') })

// signin: check existing user info
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)} )

// register: post new user info
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)} )

// profile: get user info from database
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)} )

//updates the entries and increases the count
app.put('/image', (req, res) => {image.handleImage(req, res, db)} )

// detect face with Clarifai API
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)} )

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
}); //Port 3000


/*
/ --> res = this is working
/signin --> POST = success/fail, because we are posting some data like user info
/register --> POST = user, because we want to add the data to the variable/database in our server with the new user information
/profile/:userId(so that each user will have their own homescreen) --> GET = user
/image --> PUT --> user
*/
