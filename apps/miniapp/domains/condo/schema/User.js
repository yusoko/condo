/**
 * Generated by `createschema condo.User 'name:Text;isAdmin:Checkbox;isSupport:Checkbox;type:Text' --force`
 */

const get = require('lodash/get')

const { Text, Select, Integer, Checkbox, Password } = require('@keystonejs/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { uuided, tracked, softDeleted } = require('@core/keystone/plugins')

// TODO(pahaz): move it to core? or vendor this plugin?
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')

const access = require('@miniapp/domains/condo/access/User')
const { SERVICE_USER_TYPE, USER_TYPES } = require('@miniapp/domains/condo/constants/user')

const User = new GQLListSchema('User', {
    schemaDoc: 'condo.User (exported from condo API)',
    fields: {
        v: {
            schemaDoc: 'condo.User.v',
            type: Integer,
            isRequired: true,
            defaultValue: 1,
            access: access.canAccessToIsAdminField,
            hooks: {
                resolveInput: ({ resolvedData, existingItem }) => {
                    if (get(existingItem, 'isLocal') || get(resolvedData, 'isLocal')) {
                        if (existingItem) {
                            resolvedData.v = Number(existingItem.v || 1) + 1
                        }
                    }
                    return resolvedData.v
                },
            },
        },
        name: {
            schemaDoc: 'condo.User.name',
            type: Text,
            access: access.canAccessToIsAdminField,
        },
        type: {
            schemaDoc: 'condo.User.type',
            type: Select,
            dataType: 'enum',
            options: USER_TYPES,
            defaultValue: SERVICE_USER_TYPE,
            isRequired: true,
            access: access.canAccessToIsAdminField,
        },
        isAdmin: {
            schemaDoc: 'condo.User.isAdmin',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsAdminField,
        },
        isSupport: {
            schemaDoc: 'condo.User.isSupport',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsAdminField,
        },

        // NOTE: this field should be validated by OIDC server and we just copy it.
        // This field is required for base test logic and base keystone auth logic.
        email: {
            schemaDoc: 'condo.User.email',
            type: Text,
            access: access.canAccessToIsAdminField,
        },

        // NOTE: We need some way to create admin users for test purposes.
        // We don't want to use importId and importRemoteSystem because it's already used by condo.User.
        isLocal: {
            schemaDoc: 'Is this a local user (not from oidc auth)',
            type: Checkbox,
            defaultValue: true,
            access: access.canAccessToIsAdminField,
        },

        // NOTE: This field is required for local (non oidc) auth
        password: {
            schemaDoc: 'Password. Update only (for local auth without oidc)',
            type: Password,
            access: access.canAccessToPasswordField,
        },
    },
    plugins: [uuided(), tracked(), softDeleted(), dvAndSender()],
    access: {
        read: access.canReadUsers,
        create: access.canManageUsers,
        update: access.canManageUsers,
        delete: false,
        auth: true,
    },
})

module.exports = {
    User,
}
