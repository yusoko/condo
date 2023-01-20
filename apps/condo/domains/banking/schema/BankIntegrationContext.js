/**
 * Generated by `createschema banking.BankIntegrationContext 'integration:Relationship:BankIntegration:CASCADE; organization:Relationship:Organization:CASCADE; enabled:Checkbox'`
 */

const { Relationship, Checkbox } = require('@keystonejs/fields')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/banking/access/BankIntegrationContext')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')


const BankIntegrationContext = new GQLListSchema('BankIntegrationContext', {
    schemaDoc: 'Usage of specific integration by specific organization. Contains summary information about last synchronization with data source (integration)',
    fields: {

        integration: {
            schemaDoc: 'Data source, used for this integration.',
            type: Relationship,
            ref: 'BankIntegration',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        organization: ORGANIZATION_OWNED_FIELD,

        enabled: {
            schemaDoc: 'Controls availability of sync operation for this integration. Can be disabled by support in some cases, when client dont wants to have automatic synchronization via API, for example',
            type: Checkbox,
            isRequired: true,
            defaultValue: true,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBankIntegrationContexts,
        create: access.canManageBankIntegrationContexts,
        update: access.canManageBankIntegrationContexts,
        delete: false,
        auth: true,
    },
})

module.exports = {
    BankIntegrationContext,
}
