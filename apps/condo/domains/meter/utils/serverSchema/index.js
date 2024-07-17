/**
 * Generated by `createschema meter.MeterResource 'name:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const get = require('lodash/get')
const uniq = require('lodash/uniq')

const { generateServerUtils } = require('@open-condo/codegen/generate.server.utils')
const { find } = require('@open-condo/keystone/schema')

const { GqlWithKnexLoadList } = require('@condo/domains/common/utils/serverSchema')
const { MeterResource: MeterResourceGQL } = require('@condo/domains/meter/gql')
const { MeterReadingSource: MeterReadingSourceGQL } = require('@condo/domains/meter/gql')
const { Meter: MeterGQL } = require('@condo/domains/meter/gql')
const { MeterReading: MeterReadingGQL } = require('@condo/domains/meter/gql')
const { MeterReadingFilterTemplate: MeterReadingFilterTemplateGQL } = require('@condo/domains/meter/gql')
const { PropertyMeter: PropertyMeterGQL } = require('@condo/domains/meter/gql')
const { PropertyMeterReading: PropertyMeterReadingGQL } = require('@condo/domains/meter/gql')
const { MeterReportingPeriod: MeterReportingPeriodGQL } = require('@condo/domains/meter/gql')
const { MeterResourceOwner: MeterResourceOwnerGQL } = require('@condo/domains/meter/gql')
const { REGISTER_METERS_READINGS_MUTATION } = require('@condo/domains/meter/gql')
const { MeterReadingsImportTask: MeterReadingsImportTaskGQL } = require('@condo/domains/meter/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const MeterResource = generateServerUtils(MeterResourceGQL)
const MeterReadingSource = generateServerUtils(MeterReadingSourceGQL)
const Meter = generateServerUtils(MeterGQL)
const MeterReading = generateServerUtils(MeterReadingGQL)
const MeterReadingFilterTemplate = generateServerUtils(MeterReadingFilterTemplateGQL)
const PropertyMeter = generateServerUtils(PropertyMeterGQL)
const PropertyMeterReading = generateServerUtils(PropertyMeterReadingGQL)
const MeterReportingPeriod = generateServerUtils(MeterReportingPeriodGQL)
const MeterResourceOwner = generateServerUtils(MeterResourceOwnerGQL)
async function registerMetersReadings (context, data) {
    if (!context) throw new Error('no context')
    if (!data) throw new Error('no data')
    if (!data.sender) throw new Error('no data.sender')

    return await context.executeGraphQL({
        query: REGISTER_METERS_READINGS_MUTATION,
        context: {
            req: context.req,
            ...context.createContext({ skipAccessControl: true }),
        },
        variables: { data: { dv: 1, ...data } },
    })
}

const MeterReadingsImportTask = generateServerUtils(MeterReadingsImportTaskGQL)
/* AUTOGENERATE MARKER <CONST> */

/**
 * Get all meters, which resident has access to,
 * Mostly used in access, that's why used native keystone utils
 * @param userId - id of user
 * @returns {Promise<Array<unknown>>} list of meters ids which are available for resident
 */
const getAvailableResidentMeters = async (userId) => {
    const userResidents = await find('Resident', {
        user: { id: userId, deletedAt: null },
        property: { deletedAt: null },
        organization: { deletedAt: null },
        deletedAt: null,
    })
    const residentIds = userResidents.map(resident => resident.id)

    const resourceOwners = await find('MeterResourceOwner', {
        deletedAt: null,
        addressKey_in: userResidents.map(resident => resident.addressKey),
    })

    const allUserServiceConsumers = await find('ServiceConsumer', {
        resident: { id_in: residentIds, deletedAt: null },
        organization: { deletedAt: null },
        deletedAt: null,
    })

    const orStatements = []

    for (const resourceOwner of resourceOwners) {
        const addressResidents = userResidents.filter(resident => resident.addressKey === resourceOwner.addressKey)
        const userConsumers = allUserServiceConsumers
            .filter(consumer => consumer.organization === resourceOwner.organization
                && addressResidents.find(resident => resident.id === consumer.resident) !== undefined)

        if (userConsumers.length > 0) {
            // In case organization loads meters with temporary account numbers we need to support unitName + unitType
            userConsumers.forEach(consumer => {
                orStatements.push({
                    AND: [
                        { organization: { id: resourceOwner.organization, deletedAt: null } },
                        { resource: { id: resourceOwner.resource } },
                        { property: { addressKey: resourceOwner.addressKey, deletedAt: null } },
                        { accountNumber: consumer.accountNumber },
                    ],
                })
            })
        }
    }

    return await find('Meter', {
        OR: orStatements,
        deletedAt: null,
    })
}

/**
 * Get all meter report periods, which resident has access to,
 * Mostly used in access, that's why used native keystone utils
 * @param userId - id of user
 * @returns {Promise<unknown>} list of meters ids which are available for resident
 */
async function getAvailableResidentMeterReportCondition (userId) {
    const userResidents = await find('Resident', {
        user: { id: userId, deletedAt: null },
        deletedAt: null,
    })

    const addressKeys = userResidents
        .map(resident => resident.addressKey)
        .filter(Boolean)
    const uniqueAddressKeys = uniq(addressKeys)

    const resourceOwners = await find('MeterResourceOwner', {
        addressKey_in: uniqueAddressKeys,
        deletedAt: null,
    })

    const organizationIds = resourceOwners
        .map(owner => owner.organization)
        .filter(Boolean)

    const defaultCondition = {
        organization_is_null: true,
    }

    const orgOnlyCondition = {
        AND: [
            { property_is_null: true },
            { organization: { id_in: uniq(organizationIds) } },
        ],
    }

    const propertyConditions = resourceOwners
        .filter(owner => owner.organization && owner.addressKey)
        .map(owner => ({
            AND: [
                { property: { addressKey: owner.addressKey } },
                { organization: { id: owner.organization } },
            ],
        }))

    return {
        OR: [
            defaultCondition,
            orgOnlyCondition,
            ...propertyConditions,
        ],
        deletedAt: null,
    }
}

const loadMetersForExcelExport = async ({ where = {}, sortBy = ['createdAt_DESC'] }) => {
    const metersLoader = new GqlWithKnexLoadList({
        listKey: 'Meter',
        fields: 'id unitName unitType accountNumber number place',
        singleRelations: [
            ['Property', 'property', 'address'],
            ['MeterResource', 'resource', 'id'],
        ],
        sortBy,
        where,
    })

    return await metersLoader.load()
}


const loadMeterReadingsForExcelExport = async ({ where = {}, sortBy = ['createdAt_DESC'] }) => {
    const meterReadingsLoader = new GqlWithKnexLoadList({
        listKey: 'MeterReading',
        fields: 'id date value1 value2 value3 value4 clientName',
        singleRelations: [
            ['Meter', 'meter', 'id'],
            ['MeterReadingSource', 'source', 'id'],
        ],
        sortBy,
        where,
    })

    return await meterReadingsLoader.load()
}

const loadPropertyMetersForExcelExport = async ({ where = {}, sortBy = ['createdAt_DESC'] }) => {
    const metersLoader = new GqlWithKnexLoadList({
        listKey: 'PropertyMeter',
        fields: 'id accountNumber number',
        singleRelations: [
            ['Property', 'property', 'address'],
            ['MeterResource', 'resource', 'id'],
        ],
        sortBy,
        where,
    })

    return await metersLoader.load()
}

const loadPropertyMeterReadingsForExcelExport = async ({ where = {}, sortBy = ['createdAt_DESC'] }) => {
    const meterReadingsLoader = new GqlWithKnexLoadList({
        listKey: 'PropertyMeterReading',
        fields: 'id date value1 value2 value3 value4',
        singleRelations: [
            ['PropertyMeter', 'meter', 'id'],
            ['MeterReadingSource', 'source', 'id'],
        ],
        sortBy,
        where,
    })

    return await meterReadingsLoader.load()
}

module.exports = {
    MeterResource,
    MeterReadingSource,
    Meter,
    MeterReading,
    getAvailableResidentMeters,
    getAvailableResidentMeterReportCondition,
    loadMetersForExcelExport,
    loadMeterReadingsForExcelExport,
    loadPropertyMeterReadingsForExcelExport,
    loadPropertyMetersForExcelExport,
    MeterReadingFilterTemplate,
    PropertyMeter,
    PropertyMeterReading,
    MeterReportingPeriod,
    MeterResourceOwner,
    registerMetersReadings,
    MeterReadingsImportTask,
/* AUTOGENERATE MARKER <EXPORTS> */
}
