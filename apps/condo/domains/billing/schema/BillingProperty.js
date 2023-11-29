/**
 * Generated by `createschema billing.BillingProperty 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; bindingId:Text; address:Text; raw:Json; meta:Json'`
 */

const { Text } = require('@keystonejs/fields')
const { Virtual } = require('@keystonejs/fields')

const { Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { addressService } = require('@open-condo/keystone/plugins/addressService')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { find } = require('@open-condo/keystone/schema')
const { getById } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/billing/access/BillingProperty')
const { IMPORT_ID_FIELD } = require('@condo/domains/common/schema/fields')

const { RAW_DATA_FIELD } = require('./fields/common')
const { INTEGRATION_CONTEXT_FIELD } = require('./fields/relations')

const BillingProperty = new GQLListSchema('BillingProperty', {
    schemaDoc: 'All `property` objects from `billing data source`',
    fields: {
        context: INTEGRATION_CONTEXT_FIELD,

        importId: IMPORT_ID_FIELD,

        raw: RAW_DATA_FIELD,

        globalId: {
            schemaDoc: 'A well-known universal identifier that allows you to identify the same objects in different systems. It may differ in different countries. Example: for Russia, the FIAS ID is used',
            type: Text,
            isRequired: false,
            kmigratorOptions: {
                null: true,
            },
        },

        normalizedAddress: {
            schemaDoc: '[DEPRECATED] Normalized address from `billing data source`. Used to map Properties to BillingProperties',
            type: Text,
            isRequired: false,
        },

        meta: {
            schemaDoc: 'Structured metadata obtained from the `billing data source`. Some of this data is required for use in the `receipt template`. ' +
                'Examples of data keys: `total space of building`, `property beginning of exploitation year`, `has cultural heritage status`, `number of underground floors`, `number of above-ground floors`',
            // TODO(pahaz): research keys!
            type: Json,
            isRequired: false,
        },

        property: {
            schemaDoc: 'Link to the property model',
            type: Virtual,
            graphQLReturnType: 'Property',
            graphQLReturnFragment: '{ id address addressKey }',
            resolver: async (item) => {
                const billingContext = await getById('BillingIntegrationOrganizationContext', item.context)
                const propertyConditions = item.addressKey
                    ? { OR: [{ address_i: item.address }, { addressKey: item.addressKey }] }
                    : { address_i: item.address }

                const [property] = await find('Property', {
                    organization: { id: billingContext.organization },
                    ...propertyConditions,
                    deletedAt: null,
                })

                return property
            },
        },
    },
    plugins: [uuided(), addressService(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBillingProperties,
        create: access.canManageBillingProperties,
        update: access.canManageBillingProperties,
        delete: false,
        auth: true,
    },
    /*
    // TODO(dkovyazin): DOMA-7760 Turn on after clearing of duplicates
    kmigratorOptions: {
       constraints: [
           {
               type: 'models.UniqueConstraint',
               fields: ['context', 'addressKey'],
               condition: 'Q(deletedAt__isnull=True)',
               name: 'billingProperty_unique_address',
           },
       ],
   }
   */
})

module.exports = {
    BillingProperty,
}
