/**
 * Generated by `createschema miniapp.B2CAppBuild 'app:Relationship:B2CApp:PROTECT; version:Text'`
 */

const get = require('lodash/get')
const { Text, Relationship, File } = require('@keystonejs/fields')
const { NON_ZIP_FILE_ERROR, NO_APP_ERROR } = require('@condo/domains/miniapp/constants')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { dvAndSender } = require('@condo/domains/common/schema/plugins/dvAndSender')
const access = require('@condo/domains/miniapp/access/B2CAppBuild')
const FileAdapter = require('@condo/domains/common/utils/fileAdapter')

const B2C_APP_BUILD_FILE_ADAPTER = new FileAdapter('B2CAppBuilds')


const B2CAppBuild = new GQLListSchema('B2CAppBuild', {
    schemaDoc: 'Cordova build of B2C Application',
    fields: {
        app: {
            schemaDoc: 'Link to B2C application. Exists and required for any non-deleted builds. Setting this to null automatically disconnect build from app, which will cause build deletion',
            type: Relationship,
            ref: 'B2CApp.builds',
            isRequired: false,
            kmigratorOptions: { null: true, on_delete: 'models.PROTECT' },
            access: {
                update: access.canUpdateAppLink,
            },
        },
        version: {
            schemaDoc: 'Version of build which used to control builds inside B2CApp model',
            type: Text,
            isRequired: true,
        },
        data: {
            schemaDoc: 'B2C app cordova build compressed to single .zip file',
            type: File,
            isRequired: true,
            adapter: B2C_APP_BUILD_FILE_ADAPTER,
            hooks: {
                validateInput: ({ resolvedData, fieldPath, addFieldValidationError }) => {
                    const mimetype = get(resolvedData, [fieldPath, 'mimetype'])
                    if (mimetype !== 'application/zip') {
                        addFieldValidationError(`${NON_ZIP_FILE_ERROR}, but got: ${mimetype}`)
                    }
                },
            },
        },
    },
    hooks: {
        validateInput: async ({ operation, addValidationError, resolvedData }) => {
            if (operation === 'create' && !resolvedData['app']) {
                addValidationError(NO_APP_ERROR)
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadB2CAppBuilds,
        create: access.canManageB2CAppBuilds,
        update: access.canManageB2CAppBuilds,
        delete: false,
        auth: true,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['version', 'app'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'b2c_app_build_unique_version',
            },
        ],
    },
})

module.exports = {
    B2CAppBuild,
}
