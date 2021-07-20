/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 */
const get = require('lodash/get')
const { checkRelatedOrganizationPermission } = require('../../organization/utils/accessSchema')
const { getById } = require('@core/keystone/schema')
const { checkOrganizationPermission } = require('@condo/domains/organization/utils/accessSchema')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')

async function canReadTickets ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()

    if (user.isAdmin) {
        return {}
    }

    return {
        organization: {
            OR: [
                { employees_some: { user: { id: user.id }, isBlocked: false, deletedAt: null } },
                { relatedOrganizations_some: { from: { employees_some: { user: { id: user.id }, isBlocked: false, deletedAt: null } } } },
            ],
        },
    }
}

async function canManageTickets ({ authentication: { item: user }, operation, itemId, originalInput, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true

    if (operation === 'create') {
        const organizationIdFromTicket = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationIdFromTicket) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])

        const property = await getById('Property', propertyId)
        if (!property) {
            return false
        }

        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, user.id, organizationIdFromTicket, 'canManageTickets')
        if (canManageRelatedOrganizationTickets) {
            return true
        }
        const organizationIdFromProperty = get(property, 'organization')
        const canManageTickets = await checkOrganizationPermission(user.id, organizationIdFromTicket, 'canManageTickets')
        if (!canManageTickets) {
            return false
        }

        return organizationIdFromTicket === organizationIdFromProperty

    } else if (operation === 'update') {
        if (!itemId) {
            return false
        }

        const ticket = await getById('Ticket', itemId)
        if (!ticket) {
            return false
        }

        const { organization: organizationIdFromTicket } = ticket

        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, user.id, organizationIdFromTicket, 'canManageTickets')
        if (canManageRelatedOrganizationTickets) {
            return true
        }
        const canManageTickets = await checkOrganizationPermission(user.id, organizationIdFromTicket, 'canManageTickets')
        if (!canManageTickets) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        if (propertyId) {
            const property = await getById('Property', propertyId)
            if (!property) {
                return false
            }

            const organizationIdFromProperty = get(property, 'organization')
            const isSameOrganization = organizationIdFromTicket === organizationIdFromProperty

            if (!isSameOrganization) {
                return false
            }
        }

        return true
    }

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadTickets,
    canManageTickets,
}
