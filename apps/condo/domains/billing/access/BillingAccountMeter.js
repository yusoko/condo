/**
 * Generated by `createschema billing.BillingAccountMeter 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; account:Relationship:BillingAccount:CASCADE; resource:Relationship:BillingMeterResource:PROTECT; raw:Json; meta:Json'`
 */

const { getById } = require('@core/keystone/schema')
const { checkOrganizationPermission } = require(
    '../../organization/utils/accessSchema')
const { checkBillingIntegrationAccessRight } = require('../utils/accessSchema')

async function canReadBillingAccountMeters ({ authentication: { item: user } }) {
    if (!user) return false
    if (user.isAdmin) return {}
    return {
        context: {
            integration: { accessRights_some: { user: { id: user.id } } },
        },
    }
}

async function canManageBillingAccountMeters ({ authentication: { item: user }, operation, itemId }) {
    if (!user) return false
    if (user.isAdmin) return true
    if (operation === 'create' || operation === 'update') {
        // Billing integration and Organization integration manager can create and update entities
        if (!itemId) return false
        const context = await getById('BillingIntegrationOrganizationContext', itemId)
        if (!context) return false
        const { organization: organizationId, integration: integrationId } = context
        const canManageIntegrations = await checkOrganizationPermission(user.id, organizationId, 'canManageIntegrations')
        if (canManageIntegrations) return true
        return await checkBillingIntegrationAccessRight(user.id, integrationId)
    }
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadBillingAccountMeters,
    canManageBillingAccountMeters,
}
