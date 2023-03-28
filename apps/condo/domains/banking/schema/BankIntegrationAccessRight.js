/**
 * Generated by `createschema banking.BankIntegrationAccessRight 'integration:Relationship:BankIntegration:PROTECT; user:Relationship:User:CASCADE;'`
 */

const { Relationship } = require('@keystonejs/fields')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/banking/access/BankIntegrationAccessRight')
const { SERVICE_USER_FIELD } = require('@condo/domains/miniapp/schema/fields/accessRight')


const BankIntegrationAccessRight = new GQLListSchema('BankIntegrationAccessRight', {
    schemaDoc: 'Gives ability to service-user to access all schema records, connected to specified integration',
    fields: {

        integration: {
            schemaDoc: 'Specified integration, whose connected entities will be available for specified service user',
            type: Relationship,
            ref: 'BankIntegration.accessRights',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

        user: SERVICE_USER_FIELD,

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBankIntegrationAccessRights,
        create: access.canManageBankIntegrationAccessRights,
        update: access.canManageBankIntegrationAccessRights,
        delete: false,
        auth: true,
    },
})

module.exports = {
    BankIntegrationAccessRight,
}