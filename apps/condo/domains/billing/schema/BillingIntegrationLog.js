/**
 * Generated by `createschema billing.BillingIntegrationLog 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; type:Text; message:Text; meta:Json'`
 */

const { Text } = require('@keystonejs/fields')

const { Json } = require('@open-condo/keystone/fields')
const { versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/billing/access/BillingIntegrationLog')
const { WRONG_TEXT_FORMAT } = require('@condo/domains/common/constants/errors')
const { UPPER_CASE_ALPHANUMERIC_REGEXP } = require('@condo/domains/common/constants/regexps')

const { INTEGRATION_CONTEXT_FIELD } = require('./fields/relations')


const BillingIntegrationLog = new GQLListSchema('BillingIntegrationLog', {
    schemaDoc: 'Important `integration component` log records. Sometimes you need to report some errors/problems related to the integration process. ' +
        'The target audience of these messages is the client of our API platform. You should avoid repeating the same messages. ' +
        'The existence of the message means that some problems were occurred during the integration process and the client should the user must take some actions to eliminate them',
    fields: {
        context: INTEGRATION_CONTEXT_FIELD,

        type: {
            schemaDoc: 'Message type. Our clients can use different languages. Sometimes we need to change the text message for the client. The settings for the message texts are in the integration. Ex: WRONG_AUTH_CREDENTIALS',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: ({ resolvedData, fieldPath, addFieldValidationError }) => {
                    const value = resolvedData[fieldPath]
                    if (!UPPER_CASE_ALPHANUMERIC_REGEXP.test(value)) addFieldValidationError(`${WRONG_TEXT_FORMAT}${fieldPath}] allow only [A-Z0-9_] charset`)
                },
            },
        },

        message: {
            schemaDoc: 'Client understandable message. May be overridden by integration settings for some message types',
            type: Text,
            isRequired: true,
        },

        meta: {
            schemaDoc: 'The message metadata. Context variables for generating messages. Examples of data keys: ``',
            type: Json,
            isRequired: false,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender()],
    access: {
        read: access.canReadBillingIntegrationLogs,
        create: access.canManageBillingIntegrationLogs,
        update: access.canManageBillingIntegrationLogs,
        delete: false,
        auth: true,
    },
})

module.exports = {
    BillingIntegrationLog,
}
