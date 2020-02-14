const { GraphQLDateTime } = require('graphql-iso-date');

const authResolvers = require('./auth');
const userResolvers = require('./user');
const messageResolvers = require('./message');
const venueResolvers = require('./venue');

const customScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [
  authResolvers,
  customScalarResolver,
  messageResolvers,
  userResolvers,
  venueResolvers,
];
