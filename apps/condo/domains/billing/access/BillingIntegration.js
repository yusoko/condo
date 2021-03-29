/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */

async function canReadBillingIntegrations ({ authentication: { item: user } }) {
    if (!user) return false
    if (user.isAdmin) return {}
    return {
        // TODO(codegen): write canReadBillingIntegrations logic!
    }
}

async function canManageBillingIntegrations ({ authentication: { item: user }, operation, itemId }) {
    if (!user) return false
    if (user.isAdmin) return true
    if (operation === 'create') {
        // TODO(codegen): write canManageBillingIntegrations create logic!
        return true
    } else if (operation === 'update') {
        // TODO(codegen): write canManageBillingIntegrations update logic!
        return true
    }
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadBillingIntegrations,
    canManageBillingIntegrations,
}
