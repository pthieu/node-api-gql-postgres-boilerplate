const { gql } = require('apollo-server-express');
// extend type Query {
// }
//
// extend type Mutation {
//
// }
module.exports = gql`
  
  
  type Zone {
    id: Int!
    name: String!
  }
  
  input ZoneInput {
    name: String!
  }
`
