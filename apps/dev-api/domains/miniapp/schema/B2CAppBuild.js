/**
 * Generated by `createschema miniapp.B2CAppBuild 'app:Relationship:B2CApp:CASCADE;'`
 */
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-condo/keystone/errors')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const {
    getFileMetaAfterChange,
    FileAdapter,
    getMimeTypesValidator,
} = require('@dev-api/domains/common/utils/files')
const access = require('@dev-api/domains/miniapp/access/B2CAppBuild')
const { B2C_APP_BUILD_UNIQUE_VERSION_CONSTRAINT } = require('@dev-api/domains/miniapp/constants/constraints')
const { INVALID_BUILD_VERSION } = require('@dev-api/domains/miniapp/constants/errors')
const { exportable } = require('@dev-api/domains/miniapp/plugins/exportable')

const SEM_VER_REGEX = /^\d{1,10}.\d{1,10}.\d{1,10}(?:-\w{1,64})?$/
const ERRORS = {
    INVALID_BUILD_VERSION: {
        code: BAD_USER_INPUT,
        type: INVALID_BUILD_VERSION,
        message: 'The build version must be semantically correct and be in X.Y.Z format',
        messageForUser: 'errors.INVALID_BUILD_VERSION.message',
    },
}
const BUILD_FILE_ADAPTER = new FileAdapter('B2CApps/builds', true)
const BUILD_META_AFTER_CHANGE = getFileMetaAfterChange(BUILD_FILE_ADAPTER, 'data')
const ALLOWED_MIME_TYPES = [
    // Official mimetype for zip archives, which is used in many Unix OS
    'application/zip',
    // Deprecated types only Windows uses
    'application/x-zip-compressed',
    'application/zip-compressed',
]


const B2CAppBuild = new GQLListSchema('B2CAppBuild', {
    schemaDoc: 'Cordova build of B2C Application',
    fields: {
        app: {
            schemaDoc: 'Link to B2C application',
            type: 'Relationship',
            ref: 'B2CApp',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },
        version: {
            schemaDoc: 'Version of build which used to control builds inside B2CApp model. Must follow sem-ver notation format: <MAJOR>.<MINOR>.<PATCH> (E.g. 1.0.27, 3.6.0)',
            type: 'Text',
            isRequired: true,
            hooks: {
                validateInput: ({ resolvedData, fieldPath, context }) => {
                    if (!SEM_VER_REGEX.test(resolvedData[fieldPath])) {
                        throw new GQLError(ERRORS.INVALID_BUILD_VERSION, context)
                    }
                },
            },
        },
        data: {
            schemaDoc: 'B2C app cordova build compressed to single .zip file',
            type: 'File',
            adapter: BUILD_FILE_ADAPTER,
            isRequired: true,
            hooks: {
                validateInput: getMimeTypesValidator({ allowedTypes: ALLOWED_MIME_TYPES }),
            },
        },
    },
    hooks: {
        afterChange: BUILD_META_AFTER_CHANGE,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['version', 'app'],
                condition: 'Q(deletedAt__isnull=True)',
                name: B2C_APP_BUILD_UNIQUE_VERSION_CONSTRAINT,
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), exportable(), historical()],
    access: {
        read: access.canReadB2CAppBuilds,
        create: access.canManageB2CAppBuilds,
        update: access.canManageB2CAppBuilds,
        delete: false,
        auth: true,
    },
})

module.exports = {
    B2CAppBuild,
}
