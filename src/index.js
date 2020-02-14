require('dotenv/config');
const DataLoader = require('dataloader');
const cors = require('cors');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const loaders = require('./loaders');
const morgan = require('morgan');
const resolvers = require('./resolvers');
const schema = require('./schema');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { models, sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(morgan('dev'));

const getMe = async (req) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({ force: false }).then(async () => {
  // if (isTest || isProduction) {
  //   createUsersWithMessages(new Date());
  // }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async (date) => {
  await models.User.create({
    username: 'ted',
    email: 'ted@rebelpixel.ca',
    password: 'rebelpixel',
    role: 'admin',
  });

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
