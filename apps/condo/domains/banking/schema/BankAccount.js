/**
 * Generated by `createschema banking.BankAccount 'organization:Relationship:Organization:CASCADE; tin:Text; country:Text; routingNumber:Text; number:Text; currency:Text; approvedAt?:DateTimeUtc; approvedBy?:Text; importId?:Text; territoryCode?:Text; bankName?:Text; meta?:Json; tinMeta?:Json; routingNumberMeta?:Json'`
 */

const { get } = require('lodash')

const { Text, DateTimeUtc, Select } = require('@keystonejs/fields')
const { Json } = require('@open-condo/keystone/fields')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')

const access = require('@condo/domains/banking/access/BankAccount')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const { IMPORT_ID_FIELD, CURRENCY_CODE_FIELD } = require('@condo/domains/common/schema/fields')
const { COUNTRIES } = require('@condo/domains/common/constants/countries')

const { validateTin } = require('@condo/domains/banking/utils/validate/tin.utils')
const { validateRoutingNumber } = require('@condo/domains/banking/utils/validate/routingNumber.utils')
const { validateNumber } = require('@condo/domains/banking/utils/validate/number.utils')


const BankAccount = new GQLListSchema('BankAccount', {
    schemaDoc: 'Bank account, that will have transactions, pulled from various integrated data sources',
    fields: {
        organization: ORGANIZATION_OWNED_FIELD,

        tin: {
            schemaDoc: 'Tax Identification Number',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: ({ existingItem, resolvedData, addFieldValidationError }) => {
                    const newItem = { ...existingItem, ...resolvedData }

                    const country = get(newItem, 'country')
                    const tin = get(newItem, 'tin')

                    const { result, errors } = validateTin(tin, country)

                    if ( !result ) {
                        addFieldValidationError(errors[0])
                    }
                },
            },
        },

        tinMeta: {
            schemaDoc: 'Structured metadata found by tin',
            type: Json,
            isRequired: false,
        },

        country: {
            schemaDoc: 'Country where the bank is located',
            isRequired: true,
            type: Select,
            options: Object.keys(COUNTRIES).join(','),
        },

        routingNumber: {
            schemaDoc: 'The routing transit number for the bank account.',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: ({ existingItem, resolvedData, addFieldValidationError }) => {
                    const newItem = { ...existingItem, ...resolvedData }

                    const country = get(newItem, 'country')
                    const routingNumber = get(newItem, 'routingNumber')

                    const { result, errors } = validateRoutingNumber(routingNumber, country)

                    if ( !result ) {
                        addFieldValidationError(errors[0])
                    }
                },
            },
        },

        routingNumberMeta: {
            schemaDoc: 'Structured metadata found by routing number',
            type: Json,
            isRequired: false,
        },

        number: {
            schemaDoc: 'Bank account number',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: ({ existingItem, resolvedData, addFieldValidationError }) => {
                    const newItem = { ...existingItem, ...resolvedData }

                    const country = get(newItem, 'country')
                    const number = get(newItem, 'number')
                    const routingNumber = get(newItem, 'routingNumber')

                    const { result, errors } = validateNumber(number, routingNumber, country)

                    if ( !result ) {
                        addFieldValidationError(errors[0])
                    }
                },
            },
        },

        currencyCode: CURRENCY_CODE_FIELD,

        approvedAt: {
            schemaDoc: 'When the bank account received the status of approved',
            type: DateTimeUtc,
            isRequired: false,
            access: {
                read: true,
                create: access.canManageIsApprovedField,
                update: access.canManageIsApprovedField,
            },
        },

        approvedBy: {
            schemaDoc: 'Who set the approved status for the bank account',
            type: 'Relationship',
            ref: 'User',
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            access: {
                read: true,
                create: false,
                update: false,
            },
        },

        importId: IMPORT_ID_FIELD,

        territoryCode: {
            schemaDoc: 'Location of the holder of this bank account. It depends on a country. In Russia it is OKTMO',
            type: Text,
            isRequired: false,
        },

        bankName: {
            schemaDoc: 'Bank name',
            type: Text,
            isRequired: false,
        },

        meta: {
            schemaDoc: 'Structured non-typed metadata, can be used by mini-apps or external services to store information',
            type: Json,
            isRequired: false,
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadBankAccounts,
        create: access.canManageBankAccounts,
        update: access.canManageBankAccounts,
        delete: false,
        auth: true,
    },
    hooks: {
        resolveInput: async ({ resolvedData, context }) => {

            // If bank account is being updated -> drop approvedBy and approvedAt!
            if (('approvedAt' in resolvedData && get(resolvedData, 'approvedAt'))) {
                const dateNow = new Date().toISOString()
                const { authedItem: { id } }  = context

                resolvedData.approvedAt = dateNow
                resolvedData.approvedBy = id
            } else {
                resolvedData.approvedAt = null
                resolvedData.approvedBy = null
            }

            return resolvedData
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'tin', 'routingNumber', 'number'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'Bank_account_unique_organization_tin_routingNumber_number',
            },
        ],
    },
})

module.exports = {
    BankAccount,
}
