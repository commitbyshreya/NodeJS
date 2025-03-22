const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios} = require('axios');
const logger = require('morgan');

async function startServer(){
  const app = express();
  const server = new ApolloServer({
    typeDefs : `
      type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }
      type Todo{
        id: ID!
        title: String!
        completed: Boolean!
        userId: ID!
        user:User
      }
      type Query{
        getTodos: [Todo]
        getAllUsers: [User]
        getAUser(id: ID!): User
      }  
      `,
    resolvers:{
      Todo:{
        user:async (todo) =>(await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
      },
      Query:{
        getTodos:async () =>(await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
        getAllUsers:async () =>(await axios.get('https://jsonplaceholder.typicode.com/users')).data,
        getAUser:async (parent, {id}) =>(await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
    },
  }});

  app.use(bodyParser.json());
  app.use(cors());
  app.use(logger('dev'));

  await server.start();

  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  })
}

startServer();





