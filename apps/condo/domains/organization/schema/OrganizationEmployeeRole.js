/**
 * Generated by `createschema organization.OrganizationEmployeeRole 'organization:Relationship:Organization:CASCADE; name:Text; statusTransitions:Json; canManageOrganization:Checkbox; canManageEmployees:Checkbox; canManageRoles:Checkbox; canManageIntegrations:Checkbox; canManageProperties:Checkbox; canManageTickets:Checkbox;' --force`
 */
const { COUNTRY_RELATED_STATUS_TRANSITIONS } = require('@condo/domains/ticket/constants/statusTransitions')
const { Text, Checkbox } = require('@keystonejs/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked } = require('@core/keystone/plugins')
const { Organization } = require('../utils/serverSchema')
const { ORGANIZATION_OWNED_FIELD, SENDER_FIELD, DV_FIELD } = require('../../../schema/_common')
const { rules } = require('../../../access')
const access = require('@condo/domains/organization/access/OrganizationEmployeeRole')
const { Virtual } = require('@keystonejs/fields')
const get = require('lodash/get')

const OrganizationEmployeeRole = new GQLListSchema('OrganizationEmployeeRole', {
    schemaDoc: 'Employee role name and access permissions',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        organization: ORGANIZATION_OWNED_FIELD,

        // There is no `user` reference, because Organization will have a set of pre-defined roles
        // and each employee will be associated with one of the role, not role with user.

        name: {
            type: Text,
            isRequired: true,
        },

        statusTransitions: {
            schemaDoc: 'Employee status transitions map',
            type: Virtual,
            graphQLReturnType: 'JSON',
            resolver: async (item, _, context) => {
                const organizationId = get(item, 'organization')
                const [organization] = await Organization.getAll(context, { id: organizationId })

                if (!organization) {
                    throw new Error('No organization found for OrganizationEmployeeRole')
                }

                const organizationCountry = get(organization, 'country', 'en')
                return COUNTRY_RELATED_STATUS_TRANSITIONS[organizationCountry]
            },
            access: {
                update: rules.canUpdateTicketStatusTransitions,
                create: rules.canUpdateTicketStatusTransitions,
                read: true,
            },
        },

        canManageOrganization: { type: Checkbox, defaultValue: false },
        canManageEmployees: { type: Checkbox, defaultValue: false },
        canManageRoles: { type: Checkbox, defaultValue: false },
        canManageIntegrations: { type: Checkbox, defaultValue: false },
        canManageProperties: { type: Checkbox, defaultValue: false },
        canManageTickets: { type: Checkbox, defaultValue: false },
        canManageContacts: { type: Checkbox, defaultValue: false },
        canManageTicketComments: { type: Checkbox, defaultValue: true },
        canManagePropertyResidents: { type: Checkbox, defaultValue: true },
    },
    plugins: [uuided(), versioned(), tracked(), historical()],
    access: {
        read: access.canReadOrganizationEmployeeRoles,
        create: access.canManageOrganizationEmployeeRoles,
        update: access.canManageOrganizationEmployeeRoles,
        delete: false,
        auth: true,
    },
})

module.exports = {
    OrganizationEmployeeRole,
}