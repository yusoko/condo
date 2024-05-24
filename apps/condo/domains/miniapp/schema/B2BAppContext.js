/**
 * Generated by `createschema miniapp.B2BAppContext 'integration:Relationship:B2BApp:PROTECT; organization:Relationship:Organization:PROTECT; settings:Json; state:Json;'`
 */

const { Relationship } = require('@keystonejs/fields')
const get = require('lodash/get')

const { Json } = require('@open-condo/keystone/fields')
const { getLogger } = require('@open-condo/keystone/logging')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, find } = require('@open-condo/keystone/schema')
const { webHooked } = require('@open-condo/webhooks/plugins')

const access = require('@condo/domains/miniapp/access/B2BAppContext')
const { NO_CONTEXT_STATUS_ERROR, CONTEXT_FINISHED_STATUS } = require('@condo/domains/miniapp/constants')
const { STATUS_FIELD, getStatusResolver, getStatusDescription } = require('@condo/domains/miniapp/schema/fields/context')
const { deleteB2BAppRoles } = require('@condo/domains/miniapp/tasks')
const { B2BAppRole } = require('@condo/domains/miniapp/utils/serverSchema')

const logger = getLogger('miniapp/createDefaultB2BAppRoles')

async function createDefaultB2BAppRoles (appId, organizationId, sender, context) {
    logger.info({ msg: 'Creating default B2BAppRoles for organization', organizationId, appId })
    const permissions = await find('B2BAppPermission', {
        app: { id: appId },
        deletedAt: null,
    })
    const rolePermissions = Object.assign({}, ...permissions.map(permission => ({
        [permission.key]: true,
    })))

    const employeeRoles = await find('OrganizationEmployeeRole', {
        organization: { id: organizationId },
        deletedAt: null,
        canManageB2BApps: true,
    })
    const organizationRolesIds = employeeRoles.map(role => role.id)
    logger.info({ msg: `Found ${organizationRolesIds.length} organization roles with "canManageB2BApps" flag`, organizationId, appId, organizationRolesIds })

    const existingAppRoles = await find('B2BAppRole', {
        role: { id_in: organizationRolesIds },
        deletedAt: null,
        app: { id: appId },
    })
    const rolesToSkip = new Set(existingAppRoles.map(appRole => appRole.role))

    for (const roleId of organizationRolesIds) {
        if (rolesToSkip.has(roleId)) {
            continue
        }
        logger.info({ msg: `Creating default B2BAppRole for role ${roleId}`, organizationId, roleId, appId })
        await B2BAppRole.create(context, {
            dv: 1,
            sender,
            app: { connect: { id: appId } },
            role: { connect: { id: roleId } },
            permissions: rolePermissions,
        })
    }
}

const B2BAppContext = new GQLListSchema('B2BAppContext', {
    schemaDoc: 'Object which connects B2B App and Organization. Used to determine if app is connected or not, and store settings / state of app for specific organization',
    fields: {
        app: {
            schemaDoc: 'B2B App',
            type: Relationship,
            ref: 'B2BApp',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },
        organization: {
            schemaDoc: 'Organization',
            type: Relationship,
            ref: 'Organization',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
            access: {
                create: true,
                read: true,
                update: false,
            },
        },
        meta: {
            schemaDoc: 'Data that is required for specified app to work with specified organization. Filled by app\'s service account / support and can have any JSON structure',
            type: Json,
            isRequired: false,
            access: {
                create: access.canReadAndManageSensitiveContextData,
                read: access.canReadAndManageSensitiveContextData,
            },
        },
        status: {
            ...STATUS_FIELD,
            schemaDoc: getStatusDescription('B2BApp'),
            hooks: {
                resolveInput: getStatusResolver('B2BApp', 'app'),
            },
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'app'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'b2b_app_context_unique_organization_and_app',
            },
        ],
    },
    hooks: {
        validateInput: async ({ resolvedData, existingItem, addValidationError }) => {
            const newItem = { ...existingItem, ...resolvedData }
            if (!newItem || !newItem.status) {
                return addValidationError(NO_CONTEXT_STATUS_ERROR)
            }
        },
        afterChange: async ({ existingItem, updatedItem, context }) => {
            const oldStatus = get(existingItem, 'status')
            const newStatus = get(updatedItem, 'status')
            const oldDeletedAt = get(existingItem, 'deletedAt')
            const newDeletedAt = get(updatedItem, 'deletedAt')

            const isConnectionHappened = newStatus === CONTEXT_FINISHED_STATUS && oldStatus !== newStatus
            const isSoftDeletedHappened = newDeletedAt && !oldDeletedAt

            const organizationId = updatedItem.organization
            const appId = updatedItem.app
            const sender = updatedItem.sender

            if (isSoftDeletedHappened) {
                await deleteB2BAppRoles.delay(appId, organizationId)
            } else if (isConnectionHappened) {
                await createDefaultB2BAppRoles(appId, organizationId, sender, context)
            }
        },
    },
    plugins: [
        uuided(),
        versioned(),
        tracked(),
        softDeleted(),
        dvAndSender(),
        historical(),
        webHooked(),
    ],
    access: {
        read: access.canReadB2BAppContexts,
        create: access.canManageB2BAppContexts,
        update: access.canManageB2BAppContexts,
        delete: false,
        auth: true,
    },
})

module.exports = {
    B2BAppContext,
}
