const { getGoogleAuthUrl } = require('../libs/auth/google');
const { getUserInfo } = require('../libs/auth/google');
const { createToken } = require('./user');

module.exports = {
  Query: {
    authUrls: () => {
      return {
        googleUrl: getGoogleAuthUrl()
      }
    }
  },
  Mutation: {
    registerGoogle: async (parent, { code }, { models, secret }) => {
      console.log(code);
      const {
        userInfo,
        tokens
      } = await getUserInfo({code});

      const userExists = await models.User.findOne({
        where: {
          email: userInfo.email
        }
      });

      if (!userExists) {
        models.User.create({
          accessToken: tokens.access_token,
          avatar: userInfo.picture,
          email: userInfo.email,
          name: userInfo.name,
          strategy: 'google',
          refreshToken: tokens.refresh_token,
          role: 'user',
          username: userInfo.given_name,
        })
      }

      const token = await createToken(userInfo.email, secret, '30m');

      return {
        token
      }
    }
  }
}
