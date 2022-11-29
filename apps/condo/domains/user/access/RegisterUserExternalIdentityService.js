/**
 * Generated by `createservice user.RegisterUserExternalIdentityService`
 */
const access = require('@open-condo/keystone/access')
const { RESIDENT } = require('@condo/domains/user/constants/common')

async function canRegisterUserExternalIdentity (args) {
    const { args: { data: { user: { id: userId } } }, authentication: { item: user } } = args

    if (!access.userIsAuthenticated(args)) {
        return false
    }

    return user.type === RESIDENT && user.id === userId
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canRegisterUserExternalIdentity,
}
