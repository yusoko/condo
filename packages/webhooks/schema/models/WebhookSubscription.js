const { Relationship, DateTimeUtc, Select, Text, Integer } = require('@keystonejs/fields')
const { Json } = require('@condo/keystone/fields')
const { uuided, versioned, tracked, softDeleted, dvAndSender, historical } = require('@condo/keystone/plugins')
const { GQLListSchema } = require('@condo/keystone/schema')
const access = require('@condo/webhooks/schema/access/WebhookSubscription')
const { WebHookModelValidator, getModelValidator, setModelValidator } = require('@condo/webhooks/model-validator')
const { DEFAULT_MAX_PACK_SIZE } = require('@condo/webhooks/constants')

function getWebhookSubscriptionModel (schemaPath) {
    if (!getModelValidator()) {
        setModelValidator(new WebHookModelValidator(schemaPath))
    }

    const validator = getModelValidator()

    const validateFields = ({ resolvedData, existingItem, addFieldValidationError }) => {
        const newItem = { ...existingItem, ...resolvedData }

        if (!validator) {
            return addFieldValidationError(`Invalid fields for model "${newItem.model}" was provided. Details: ["Validator for this model is not specified!"]`)
        }

        const { isValid, errors } = validator.validateFields(newItem.model, newItem['fields'])
        if (!isValid) {
            const errorMessage = errors.map(error => {
                if (typeof error === 'string') {
                    return `"${error}"`
                } else {
                    return JSON.stringify(error)
                }
            }).join(', ')
            return addFieldValidationError(`Invalid fields for model "${newItem.model}" was provided. Details: [${errorMessage}]`)
        }
    }

    const validateFilters = ({ resolvedData, existingItem, addFieldValidationError }) => {
        const newItem = { ...existingItem, ...resolvedData }

        if (!validator) {
            return addFieldValidationError(`Invalid filters for model "${newItem.model}" was provided. Details: ["Validator for this model is not specified!"]`)
        }

        const { isValid, errors } = validator.validateFilters(newItem.model, newItem['filters'])
        if (!isValid) {
            return addFieldValidationError(`Invalid filters for model "${newItem.model}" was provided. Details: ${JSON.stringify(errors)}`)
        }
    }


    return new GQLListSchema('WebhookSubscription', {
        schemaDoc: 'Determines which models the WebHook will be subscribed to. When model changes subscription task will be triggered to resolve changed data and send a webhook',
        fields: {
            webhook: {
                schemaDoc: 'Link to a webhook containing information about integration',
                type: Relationship,
                ref: 'Webhook',
                isRequired: true,
                knexOptions: { isNotNullable: true },
                kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            },
            url: {
                schemaDoc: 'Webhook target URL to which requests will be sent. Overrides url from webhook relation. ' +
                    'Used in case when you need to send specific model to a separate url',
                type: 'Url',
                isRequired: false,
            },
            syncedAt: {
                schemaDoc: 'The time was the data was last synced. At the next synchronization, only objects that have changed since that time will be sent.',
                type: DateTimeUtc,
                isRequired: true,
            },
            syncedAmount: {
                schemaDoc: 'The number of objects successfully delivered by webhooks. ' +
                    'On successful synchronization, the syncedAt field is updated and syncedAmount becomes 0. ' +
                    'If the remote server fails, syncedAt will not be updated, and syncedAmount will increment to the number of successfully delivered objects.',
                type: Integer,
                isRequired: true,
                defaultValue: 0,
                hooks: {
                    resolveInput: ({ resolvedData, fieldPath }) => {
                        if (resolvedData['syncedAt'] && !resolvedData[fieldPath]) {
                            return 0
                        } else {
                            return resolvedData[fieldPath]
                        }
                    },
                },
            },
            model: {
                schemaDoc: 'The data model (schema) that the webhook is subscribed to',
                type: Select,
                dataType: 'string',
                isRequired: true,
                options: validator.models,
                hooks: {
                    validateInput: (args) => {
                        validateFields(args)
                        validateFilters(args)
                    },
                },
            },
            fields: {
                schemaDoc: 'String representing list of model fields in graphql-query format. ' +
                    'Exactly the fields specified here will be sent by the webhook. ' +
                    'Correct examples: "field1 field2 { subfield }", "{ field1 relation { subfield } }"',
                type: Text,
                isRequired: true,
                hooks: {
                    resolveInput: ({ resolvedData, fieldPath }) => {
                        if (!resolvedData[fieldPath]) return resolvedData[fieldPath]
                        return WebHookModelValidator.normalizeFieldsString(resolvedData[fieldPath])
                    },
                    validateInput: validateFields,
                },
            },
            filters: {
                schemaDoc: 'Filters which is stored in JSON and used to filter models sent by the webhook. ' +
                    'Examples of filters can be found in ModelWhereInput GQL type, ' +
                    'where Model is name of your model',
                type: Json,
                isRequired: true,
                kmigratorOptions: { null: false },
                hooks: {
                    validateInput: validateFilters,
                },
            },
            maxPackSize: {
                schemaDoc: 'The maximum number of objects that the server can send in one request. ' +
                    `The default is ${DEFAULT_MAX_PACK_SIZE}, and maxPackSize cannot be set beyond this value. ` +
                    'In most cases, you do not need to override this field, but it is recommended to lower this value ' +
                    'for requests with a large number of related fields ' +
                    'or in case of external restrictions of the server accepting webhooks.',
                type: Integer,
                isRequired: false,
                hooks: {
                    validateInput: ({ resolvedData, fieldPath, addFieldValidationError }) => {
                        if (resolvedData[fieldPath] <= 0 || resolvedData[fieldPath] > DEFAULT_MAX_PACK_SIZE) {
                            return addFieldValidationError(`Invalid maxPackSize value. The correct value must be in the range [1; ${DEFAULT_MAX_PACK_SIZE}]`)
                        }
                    },
                },
            },
        },
        plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
        access: {
            read: access.canReadWebhookSubscriptions,
            create: access.canManageWebhookSubscriptions,
            update: access.canManageWebhookSubscriptions,
            delete: false,
            auth: true,
        },
    })
}

module.exports = {
    getWebhookSubscriptionModel,
}