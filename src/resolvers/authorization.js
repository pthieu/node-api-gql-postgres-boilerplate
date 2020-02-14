const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

function isAuthenticated(parent, args, { me }) {
  return me ? skip : new ForbiddenError('Not authenticated as user.');
}
  

async function isMessageOwner(parent, { id }, { models, me }) {
  const message = await models.Message.findById(id, { raw: true });

  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.'),
);

module.exports = {
  isAdmin,
  isAuthenticated,
  isMessageOwner,
};
