/**
 * Generated by `createschema ticket.CallRecord 'organization:Relationship:Organization:CASCADE;file?:File;callerPhone:Text;destCallerPhone:Text;talkTime:Integer;startDate:DateTimeUtc;isIncomingCall:Checkbox;importId:Text;'`
 */

const get = require('lodash/get')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getByCondition } = require('@open-condo/keystone/schema')

const { queryOrganizationEmployeeFor, queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('@condo/domains/organization/utils/accessSchema')

async function canReadCallRecords ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isAdmin) return {}

    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(user.id),
                queryOrganizationEmployeeFromRelatedOrganizationFor(user.id),
            ],
        },
    }
}

async function canManageCallRecords ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    let organizationId
    if (operation === 'create') {
        organizationId = get(originalInput, 'organization.connect.id', null)
    } else if (operation === 'update') {
        if (!itemId) return false
        const item = await getByCondition('CallRecord', {
            id: itemId,
            deletedAt: null,
        })

        organizationId = get(item, 'organization', null)
    }
    if (!organizationId) return false

    return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageCallRecords')
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadCallRecords,
    canManageCallRecords,
}
