const { gql } = require('apollo-server-express');

const authSchema = require('./auth');
const messageSchema = require('./message');
const userSchema = require('./user');
const venueSchema = require('./venue');
const zoneSchema = require('./zone');

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [
  linkSchema,
  authSchema,
  messageSchema,
  userSchema,
  venueSchema,
  zoneSchema,
];
