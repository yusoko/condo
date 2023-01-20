/**
 * Generated by `createschema scope.PropertyScope 'name:Text; organization:Relationship:Organization:CASCADE;isDefault:Checkbox;'`
 */
const { Checkbox } = require('@keystonejs/fields')
const get = require('lodash/get')

const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-condo/keystone/errors')
const { LocalizedText } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const access = require('@condo/domains/scope/access/PropertyScope')
const { MAX_NAME_LENGTH_ERROR } = require('@condo/domains/scope/constants/errors')
const { MAX_NAME_LENGTH } = require('@condo/domains/scope/constants/index')
const { deleteRelatedPropertyScopeOrganizationEmployee, deleteRelatedPropertyScopeProperty } = require('@condo/domains/scope/tasks')

const ERRORS = {
    MAX_NAME_LENGTH: {
        code: BAD_USER_INPUT,
        type: MAX_NAME_LENGTH_ERROR,
        message: `Maximum size of PropertyScope name exceeded (${MAX_NAME_LENGTH} characters)`,
        messageForUser: 'api.propertyScope.MAX_NAME_LENGTH_ERROR',
        messageInterpolation: {
            max: MAX_NAME_LENGTH,
        },
    },
}

const PropertyScope = new GQLListSchema('PropertyScope', {
    schemaDoc: 'A set of properties that limits the visibility of the organization\'s objects to the specified employees',
    fields: {
        name: {
            schemaDoc: 'The name of the zone that limits the visibility of employees by properties',
            type: LocalizedText,
            isRequired: true,
            template: 'pages.condo.settings.propertyScope.default.name',
            hooks: {
                validateInput: ({ resolvedData, fieldPath, context }) => {
                    if (resolvedData[fieldPath] && resolvedData[fieldPath].length > MAX_NAME_LENGTH) {
                        throw new GQLError(ERRORS.MAX_NAME_LENGTH, context)
                    }
                },
            },
        },

        organization: ORGANIZATION_OWNED_FIELD,

        hasAllProperties: {
            schemaDoc: 'True if PropertyScope includes all properties in organization',
            type: Checkbox,
            defaultValue: false,
        },

        hasAllEmployees: {
            schemaDoc: 'True if PropertyScope includes all employees in organization',
            type: Checkbox,
            defaultValue: false,
        },

    },
    hooks: {
        afterChange: async ({ operation, originalInput, updatedItem }) => {
            if (operation === 'update') {
                const deletedPropertyScopeAt = get(originalInput, 'deletedAt')

                if (deletedPropertyScopeAt) {
                    await deleteRelatedPropertyScopeOrganizationEmployee.delay(updatedItem, deletedPropertyScopeAt)
                    await deleteRelatedPropertyScopeProperty.delay(updatedItem, deletedPropertyScopeAt)
                }
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadPropertyScopes,
        create: access.canManagePropertyScopes,
        update: access.canManagePropertyScopes,
        delete: false,
        auth: true,
    },
})

module.exports = {
    PropertyScope,
}
