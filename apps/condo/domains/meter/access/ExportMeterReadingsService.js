/**
 * Generated by `createservice meter.ExportMeterReadingsService --type queries`
 */
const get = require('lodash/get')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { find } = require('@open-condo/keystone/schema')

const { checkOrganizationPermission, checkRelatedOrganizationPermission } = require('@condo/domains/organization/utils/accessSchema')

async function canExportMeterReadings ({ args: { data: { where } }, authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    const organizationId = get(where, ['organization', 'id'])

    if (organizationId) {
        return await checkOrganizationPermission(user.id, organizationId, 'canManageMeters')
    } else {
        const organizationWhere = get(where, 'organization')
        if (!organizationWhere) return false
        const [relatedFromOrganization] = await find('Organization', organizationWhere)
        if (!relatedFromOrganization) return false

        return await checkRelatedOrganizationPermission(user.id, relatedFromOrganization.id, 'canManageMeters')
    }
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canExportMeterReadings,
}