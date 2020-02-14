const { gql } = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        authUrls: AuthUrls
    }
    
    extend type Mutation {
        registerGoogle(code: String!): Token
    }

    type AuthUrls {
        googleUrl: String
    }
`;
