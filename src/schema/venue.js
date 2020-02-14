const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    myVenues: [Venue]
    getVenue(id: Int!): Venue
  }
  
  extend type Mutation {
    createVenue(input: VenueInput!): Venue
    updateVenue(id: Int!, input: VenueInput!): Venue
  }
  
  type Venue {
    id: Int!
    name: String!
    address: String!
    createdAt: Date
    lat: String
    lng: String
    googlePlaceId: String,
    googleFormattedAddress: String,
    zones: [Zone]
  }
  
  input VenueInput { 
    name: String!
    address: String!
    zones: [ZoneInput]
  }
`
