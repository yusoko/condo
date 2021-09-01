/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */
const { MeterReading } = require('../utils/serverSchema')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { Property } = require('@condo/domains/property/utils/serverSchema')
const get = require('lodash/get')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('../../organization/utils/accessSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')


async function canReadMeterReadings ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return {}

    if (user.type === RESIDENT) {
        return {
            createdBy: { id: user.id },
        }
    }
    const userId = user.id
    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(userId),
                queryOrganizationEmployeeFromRelatedOrganizationFor(userId),
            ],
        },
    }
}

async function canManageMeterReadings ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true

    if (operation === 'create') {
        const organizationIdFromMeterReading = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationIdFromMeterReading) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        const [property] = await Property.getAll(context, { id: propertyId })
        if (!property) {
            return false
        }

        if (user.type === RESIDENT) {
            return true
        }

        const organizationIdFromProperty = get(property, ['organization', 'id'])
        if (organizationIdFromMeterReading !== organizationIdFromProperty)
            return false

        return await checkPermissionInUserOrganizationOrRelatedOrganization(context, user.id, organizationIdFromMeterReading, 'canManageMeters')

    }
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadMeterReadings,
    canManageMeterReadings,
}
