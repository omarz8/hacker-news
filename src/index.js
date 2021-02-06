const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const { PubSub } = require('apollo-server')
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription');
const { Console } = require('console');


const prisma = new PrismaClient()
const pubsub = new PubSub()

const resolvers = {
  Query,
  Mutation,
  User,
  Link, 
  Subscription,
  Vote
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) =>{
    return {
      ...req,
      prisma,
      pubsub,
      userId:
      req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
})

const PORT= process.env.PORT || 4000;

  server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => { 
    console.log(`Server ready at ${url}`); });