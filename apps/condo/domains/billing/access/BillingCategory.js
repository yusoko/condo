// @ts-nocheck
/**
 * Generated by `createschema billing.BillingCategory 'name:Text'`
 */

const { throwAuthenticationError } = require('@condo/keystone/apolloErrorFormatter')

async function canReadBillingCategories ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return {}
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadBillingCategories,
}
