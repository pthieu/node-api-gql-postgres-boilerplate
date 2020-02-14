const {combineResolvers} = require("graphql-resolvers");

const { geocodeAddress } = require('../libs/geocode');
const { isAdmin, isAuthenticated } = require('./authorization');
const Zone = require('../models/zone');

module.exports = {
  Query: {
    getVenue: combineResolvers(
      // isAuthenticated,
      async (parent, { id }, { models, me }) => {
        // if (!me) {
        //   return null;
        // }
        try {
          return await models.Venue.findOne({
            include: [
              {model: models.Zone}
            ],
            where: {
              id,
              userId: 1,
            }
          });
        } catch (e) {
          console.log(e);
          return {}
        }
      }),
    myVenues: combineResolvers(
      // isAuthenticated,
      async (parent, args, { models, me }) => {
      // if (!me) {
      //   return null;
      // }
        try {
          return await models.Venue.findAll({
            include: [
              {model: models.Zone}
            ],
            where: {
              userId: 1
            }
          });
        } catch (e) {
          console.log(e);
          return []
        }
    }),
  },
  Mutation: {
    createVenue: combineResolvers(
    // isAuthenticated,
      async (parent, { input }, {models, me}) => {
        const {
          address,
          name,
          zones = []
        } = input;

        const {
          formattedAddress: googleFormattedAddress,
          googlePlaceId,
          lat,
          lng
        } = await geocodeAddress({address});
        const venue = await models.Venue.create({
          name,
          address,
          googlePlaceId,
          googleFormattedAddress,
          lat,
          lng,
          userId: me && me.id || 1 // @TODO remove
        });

        zones.forEach(async ({name}) => {
          await models.Zone.create({
            name,
            venueId: venue.id
          })
        });

        return venue;
      }
    ),
    updateVenue: combineResolvers(
      // isAuthenticated,
      async (parent, { id, input }, {models, me}) => {
      }
    )
  }
}
