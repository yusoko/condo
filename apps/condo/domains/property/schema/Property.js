/**
 * Generated by `createschema property.Property 'organization:Text; name:Text; address:Text; addressMeta:Json; type:Select:building,village; map?:Json'`
 */

const get = require('lodash/get')
const isEmpty = require('lodash/isEmpty')
const Ajv = require('ajv')
const dayjs = require('dayjs')

const { Text, Select, Virtual, Integer, CalendarDay, Decimal } = require('@keystonejs/fields')
const { Json } = require('@open-condo/keystone/fields')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { Checkbox } = require('@keystonejs/fields')

const { compareStrI } = require('@condo/domains/common/utils/string.utils')
const { hasDbFields } = require('@condo/domains/common/utils/validation.utils')
const {
    JSON_UNKNOWN_VERSION_ERROR,
    JSON_SCHEMA_VALIDATION_ERROR,
    JSON_EXPECT_OBJECT_ERROR,
} = require('@condo/domains/common/constants/errors')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const { PROPERTY_MAP_JSON_FIELDS } = require('@condo/domains/property/gql')
const access = require('@condo/domains/property/access/Property')
const MapSchemaJSON = require('@condo/domains/property/components/panels/Builder/MapJsonSchema.json')
const { manageResidentToPropertyAndOrganizationConnections } = require('@condo/domains/resident/tasks')
const { manageTicketPropertyAddressChange } = require('@condo/domains/ticket/tasks')

const { PROPERTY_MAP_GRAPHQL_TYPES } = require('@condo/domains/property/gql')
const { Ticket } = require('@condo/domains/ticket/utils/serverSchema')
const { Property: PropertyAPI } = require('@condo/domains/property/utils/serverSchema')
const { normalizePropertyMap } = require('@condo/domains/property/utils/serverSchema/helpers')
const { softDeleteTicketHintPropertiesByProperty } = require('@condo/domains/ticket/utils/serverSchema/resolveHelpers')
const { addressService } = require('@open-condo/keystone/plugins/addressService')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-condo/keystone/errors')
const { PROPERTY_ALREADY_EXISTS } = require('@condo/domains/property/constants/errors')
const { softDeletePropertyScopeProperties } = require('@condo/domains/scope/utils/serverSchema')

const ajv = new Ajv()
const jsonMapValidator = ajv.compile(MapSchemaJSON)
const REQUIRED_FIELDS = ['organization', 'type', 'address', 'addressMeta']

const ERRORS = {
    SAME_ADDRESS: (existingPropertyId) => ({
        query: 'createProperty',
        code: BAD_USER_INPUT,
        type: PROPERTY_ALREADY_EXISTS,
        message: `Property with the same address (id=${existingPropertyId}) already exists in current organization`,
        messageForUser: 'api.property.create.sameAddressError',
    }),
}

const addressFieldHooks = {
    validateInput: async ({ resolvedData, fieldPath, context, existingItem, operation }) => {
        const value = resolvedData[fieldPath]
        const isCreate = operation === 'create'
        const isUpdateAddress = operation === 'update' && resolvedData.address !== existingItem.address

        if (isCreate || isUpdateAddress) {
            const organizationId = isCreate ? resolvedData.organization : existingItem.organization
            const addressSearch = isCreate ? { address_i: value } : { address: value }
            //todo(AleX83Xpert) compare by addressKey instead of address string
            const where = {
                ...addressSearch,
                organization: {
                    id: organizationId,
                },
                deletedAt: null,
            }
            const sameAddressProperties = await PropertyAPI.getAll(context, where, { first: 1 })

            if (!isEmpty(sameAddressProperties)) {
                throw new GQLError(ERRORS.SAME_ADDRESS(get(sameAddressProperties, [0, 'id'])), context)
            }
        }
    },
}

// ORGANIZATION_OWNED_FIELD
const Property = new GQLListSchema('Property', {
    schemaDoc: 'Common property. The property is divided into separate `unit` parts, each of which can be owned by an independent owner. Community farm, residential buildings, or a cottage settlement',
    fields: {

        organization: ORGANIZATION_OWNED_FIELD,

        name: {
            schemaDoc: 'Client understandable Property name. A well-known property name for the client',
            type: Text,
            isRequired: false,
        },

        type: {
            schemaDoc: 'Common property type',
            type: Select,
            options: 'building,village',
            isRequired: true,
        },

        map: {
            schemaDoc: 'Property map/schema',
            type: Json,
            extendGraphQLTypes: [PROPERTY_MAP_GRAPHQL_TYPES],
            graphQLReturnType: 'BuildingMap',
            graphQLAdminFragment: `{ ${PROPERTY_MAP_JSON_FIELDS} }`,
            isRequired: false,
            hooks: {
                resolveInput: ({ resolvedData }) => {
                    const { map } = resolvedData
                    if (map) {
                        return normalizePropertyMap(map)
                    }
                },
                validateInput: ({ resolvedData, fieldPath, addFieldValidationError }) => {
                    if (!resolvedData.hasOwnProperty(fieldPath)) return // skip if on value
                    const value = resolvedData[fieldPath]
                    if (value === null) return // null is OK
                    if (typeof value !== 'object') {
                        return addFieldValidationError(`${JSON_EXPECT_OBJECT_ERROR}${fieldPath}] ${fieldPath} field type error. We expect JSON Object`)
                    }
                    const { dv } = value
                    if (dv === 1) {
                        if (!jsonMapValidator(value)) {
                            return addFieldValidationError(`${JSON_SCHEMA_VALIDATION_ERROR}] invalid json structure of "map" field`)
                        }
                    } else {
                        return addFieldValidationError(`${JSON_UNKNOWN_VERSION_ERROR}${fieldPath}] Unknown \`dv\` attr inside JSON Object`)
                    }
                },
            },
        },
        unitsCount: {
            schemaDoc: 'A number of parts in the property. The number of flats for property.type = house. The number of garden houses for property.type = village.',
            type: Integer,
            isRequired: true,
            defaultValue: 0,
            hooks: {
                resolveInput: async ({ operation, existingItem, resolvedData }) => {
                    const getTotalUnitsCount = (map) => {
                        return get(map, 'sections', [])
                            .map((section) => get(section, 'floors', [])
                                .map(floor => get(floor, 'units', [])))
                            .flat(2).filter(unit => {
                                const unitType = get(unit, 'unitType', 'flat')
                                // unitType may be null with old property data, so all these units used to be 'flat' type by default
                                return !isEmpty(unitType) ? unitType === 'flat' : isEmpty(unitType)
                            }).length
                    }

                    let unitsCount = 0

                    if (operation === 'create') {
                        const map = get(resolvedData, 'map')

                        if (map) {
                            unitsCount = getTotalUnitsCount(map)
                        }
                    }

                    if (operation === 'update') {
                        const existingMap = get(existingItem, 'map')
                        const updatedMap = get(resolvedData, 'map')

                        const isMapDeleted = existingMap && !updatedMap

                        if (isMapDeleted) {
                            unitsCount = 0
                        } else if (updatedMap) {
                            unitsCount = getTotalUnitsCount(updatedMap)
                        }
                    }

                    return unitsCount
                },
            },
        },
        // TODO(pahaz): DOMA-2426 what if property type village?
        uninhabitedUnitsCount: {
            schemaDoc: 'A number of non-residential units. Number of parking places for unit.unitType = parking, apartment, commercial & warehouse',
            type: Integer,
            isRequired: true,
            defaultValue: 0,
            hooks: {
                resolveInput: async ({ operation, existingItem, resolvedData }) => {
                    let uninhabitedUnitsCount = 0
                    const getUninhabitedUnitsCount = (map) => {
                        const parkingSection = get(map, 'parking', [])
                        const parkingUnitsCount = !isEmpty(parkingSection) ? parkingSection
                            .map((section) => get(section, 'floors', [])
                                .map(floor => get(floor, 'units', []).length),
                            )
                            .flat()
                            .reduce((total, unitsOnFloor) => total + unitsOnFloor, 0) : 0

                        const sectionUnitsCount = get(map, 'sections', [])
                            .map((section) => get(section, 'floors', [])
                                .map(floor => get(floor, 'units', [])))
                            .flat(2).filter(unit => {
                                const unitType = get(unit, 'unitType', 'flat')
                                return !isEmpty(unitType) ? unitType !== 'flat' : !isEmpty(unitType)
                            }).length

                        return parkingUnitsCount + sectionUnitsCount
                    }

                    if (operation === 'create') {
                        const map = get(resolvedData, 'map')

                        if (map) {
                            uninhabitedUnitsCount = getUninhabitedUnitsCount(map)
                        }
                    }

                    if (operation === 'update') {
                        const existingMap = get(existingItem, 'map')
                        const updatedMap = get(resolvedData, 'map')

                        const isMapDeleted = existingMap && !updatedMap

                        if (isMapDeleted) {
                            uninhabitedUnitsCount = 0
                        } else if (updatedMap) {
                            uninhabitedUnitsCount = getUninhabitedUnitsCount(updatedMap)
                        }
                    }

                    return uninhabitedUnitsCount
                },
            },
        },
        ticketsClosed: {
            schemaDoc: 'Counter for closed tickets',
            type: Virtual,
            resolver: async (item, _, context) => {
                return await Ticket.count(context, {
                    property: { id: item.id },
                    status: { type: 'closed' },
                })
            },
        },

        ticketsDeferred: {
            schemaDoc: 'Counter for deferred tickets',
            type: Virtual,
            resolver: async (item, _, context) => {
                return await Ticket.count(context, {
                    property: { id: item.id },
                    status: { type: 'deferred' },
                })
            },
        },

        ticketsInWork: {
            schemaDoc: 'Counter for not closed tickets',
            type: Virtual,
            resolver: async (item, _, context) => {
                return await Ticket.count(context, {
                    property: { id: item.id },
                    status: { type_not_in: ['closed', 'canceled', 'deferred'] },
                })
            },
        },

        isApproved: {
            schemaDoc: 'Whether or not this organization can manage this property. Usually set by support. Defaults to False. Field is dropped to false if address is updated',
            type: Checkbox,
            access: {
                read: true,
                create: access.canManageIsApprovedField,
                update: access.canManageIsApprovedField,
            },
            defaultValue: false,
            kmigratorOptions: { null: false },
        },

        yearOfConstruction: {
            schemaDoc: 'Year of the property was built',
            type: CalendarDay,
            format: 'YYYY',
            yearRangeTo: dayjs().year(),
        },

        // TODO(pahaz): DOMA-2426 what if property type village?
        area: {
            schemaDoc: 'Property area in square meters',
            type: Decimal,
            knexOptions: {
                scale: 2,
            },
        },
    },
    plugins: [uuided(), addressService({ fieldsHooks: { address: addressFieldHooks } }), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        auth: true,
        delete: false,
        read: access.canReadProperties,
        create: access.canManageProperties,
        update: access.canManageProperties,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'address'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'property_unique_organization_and_address',
            },
        ],
    },
    hooks: {
        validateInput: ({ resolvedData, existingItem, context, addValidationError }) => {
            if (!hasDbFields(REQUIRED_FIELDS, resolvedData, existingItem, context, addValidationError)) return
        },
        resolveInput: async ({ operation, resolvedData }) => {
            // If address is being updated -> drop isApproved!
            if (operation === 'update' && 'address' in resolvedData) {
                resolvedData.isApproved = false
            }
            return resolvedData
        },
        afterChange: async ({ context, operation, existingItem, updatedItem }) => {
            const isSoftDeleteOperation = operation === 'update' && !existingItem.deletedAt && Boolean(updatedItem.deletedAt)
            const isCreatedProperty = operation === 'create' && Boolean(updatedItem.address)
            const isRestoredProperty = operation === 'update' && Boolean(existingItem.deletedAt) && !updatedItem.deletedAt
            // TODO(DOMA-1779): detect property.address locale
            const isAddressUpdated = operation === 'update' && !compareStrI(existingItem.address, updatedItem.address)
            const affectedAddress = isSoftDeleteOperation || isAddressUpdated ? existingItem.address : updatedItem.address

            // We handle resident reconnections only for these operation types
            if (isCreatedProperty || isRestoredProperty || isSoftDeleteOperation || isAddressUpdated) {
                if (isAddressUpdated) {
                    // Change linked tickets "propertyAddress"
                    const userInfo = { dv: updatedItem.dv, sender: updatedItem.sender }
                    await manageTicketPropertyAddressChange.delay(updatedItem.id, userInfo)
                    // Reconnect residents (if any) to oldest non-deleted property with address = updatedItem.address
                    await manageResidentToPropertyAndOrganizationConnections.delay(updatedItem.address, updatedItem.dv, updatedItem.sender)
                }

                // Reconnect residents (if any) to oldest non-deleted property with address = affectedAddress
                await manageResidentToPropertyAndOrganizationConnections.delay(affectedAddress, updatedItem.dv, updatedItem.sender)

                if (isSoftDeleteOperation) {
                    await softDeleteTicketHintPropertiesByProperty(context, updatedItem)
                    await softDeletePropertyScopeProperties(context, updatedItem)
                }
            }
        },
    },
})

module.exports = {
    Property,
}
