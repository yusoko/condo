/**
 * Generated by `createschema meter.Meter 'number:Text; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; unitName:Text; place?:Text; resource:Relationship:MeterResource:CASCADE;'`
 */
const { Text, Relationship, Integer, DateTimeUtc, Checkbox } = require('@keystonejs/fields')
const get = require('lodash/get')

const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema, find, getByCondition, getById } = require('@open-condo/keystone/schema')

const { UNIQUE_ALREADY_EXISTS_ERROR } = require('@condo/domains/common/constants/errors')
const { UNIT_TYPE_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/meter/access/Meter')
const { AUTOMATIC_METER_NO_MASTER_APP, B2B_APP_NOT_CONNECTED, B2C_APP_NOT_AVAILABLE } = require('@condo/domains/meter/constants/errors')
const { deleteReadingsOfDeletedMeter } = require('@condo/domains/meter/tasks')
const { ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')
const { RESIDENT } = require('@condo/domains/user/constants/common')

const { Meter: MeterApi } = require('./../utils/serverSchema')



const Meter = new GQLListSchema('Meter', {
    schemaDoc: 'Resource meter at a certain place in the unitName',
    fields: {
        organization: ORGANIZATION_OWNED_FIELD,
        property: {
            schemaDoc: 'Link to property which contains unit with this meter',
            type: Relationship,
            ref: 'Property',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },
        number: {
            schemaDoc: 'Number of resource meter, such as "А03 9908"',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: async ({ context, operation, existingItem, resolvedData, fieldPath, addFieldValidationError }) => {
                    // should be unique inside organization
                    const value = resolvedData[fieldPath]
                    let metersWithSameResourceAndNumberInOrganization
                    if (operation === 'create') {
                        metersWithSameResourceAndNumberInOrganization = await find('Meter', {
                            number: value,
                            organization: { id: resolvedData.organization },
                            resource: { id: resolvedData.resource },
                            deletedAt: null,
                        })
                    }
                    else if (operation === 'update' && resolvedData.number !== existingItem.number) {
                        const organization = resolvedData.organization ? resolvedData.organization : existingItem.organization
                        const resource = resolvedData.resource ? resolvedData.resource : existingItem.resource

                        metersWithSameResourceAndNumberInOrganization = await MeterApi.getAll(context, {
                            number: value,
                            organization: { id: organization },
                            resource: { id: resource },
                            deletedAt: null,
                        })
                    }

                    if (metersWithSameResourceAndNumberInOrganization && metersWithSameResourceAndNumberInOrganization.length > 0) {
                        addFieldValidationError(`${UNIQUE_ALREADY_EXISTS_ERROR}${fieldPath}] Meter with same number and resource exist in current organization`)
                    }
                },
            },
        },
        numberOfTariffs: {
            type: Integer,
            isRequired: true,
        },
        installationDate: {
            schemaDoc: 'Date when the meter was installed in the unit',
            type: DateTimeUtc,
        },
        commissioningDate: {
            schemaDoc: 'Date when the meter was commissioned.' +
                'Commissioning - documentation of the meter as a billing meter',
            type: DateTimeUtc,
        },
        verificationDate: {
            schemaDoc: 'The date when the employee came and checked how accurately the meter counts the resource',
            type: DateTimeUtc,
        },
        nextVerificationDate: {
            schemaDoc: 'The date of the next meter verification.' +
                'For example, for a cold water meter - usually 6 years after the verification date',
            type: DateTimeUtc,
        },
        controlReadingsDate: {
            schemaDoc: 'The date when the employee came and took readings from the meter',
            type: DateTimeUtc,
        },
        sealingDate: {
            schemaDoc: 'The date when meter was sealed.' +
                'Sealing is the installation of a unique single-use device (directly a seal and a sealing rope)' +
                'on the metering device, which is designed to control unauthorized access to the equipment.',
            type: DateTimeUtc,
        },
        accountNumber: {
            schemaDoc: 'Client\'s billing account',
            type: Text,
            isRequired: true,
            hooks: {
                validateInput: async ({ context, operation, existingItem, resolvedData, fieldPath, addFieldValidationError }) => {
                    const value = resolvedData[fieldPath]
                    let metersWithSameAccountNumberInOtherUnit
                    if (operation === 'create') {
                        metersWithSameAccountNumberInOtherUnit = await MeterApi.getAll(context, {
                            accountNumber: value,
                            organization: { id: resolvedData.organization },
                            deletedAt: null,
                            OR: [
                                { unitName_not: resolvedData.unitName },
                                { property: { id_not: resolvedData.property } },
                            ],
                        })
                    }
                    else if (operation === 'update' && resolvedData.accountNumber !== existingItem.accountNumber) {
                        const organization = resolvedData.organization ? resolvedData.organization : existingItem.organization
                        const property = resolvedData.property ? resolvedData.property : existingItem.property
                        const unitName = resolvedData.unitName ? resolvedData.unitName : existingItem.unitName

                        metersWithSameAccountNumberInOtherUnit = await MeterApi.getAll(context, {
                            accountNumber: value,
                            organization: { id: organization },
                            deletedAt: null,
                            OR: [
                                { unitName_not: unitName },
                                { property: { id_not: property } },
                            ],
                        })
                    }

                    if (metersWithSameAccountNumberInOtherUnit && metersWithSameAccountNumberInOtherUnit.length > 0) {
                        addFieldValidationError(`${UNIQUE_ALREADY_EXISTS_ERROR}${fieldPath}] Meter with same account number exist in current organization in other unit`)
                    }
                },
            },
        },
        unitName: {
            schemaDoc: 'Unit with this meter',
            type: Text,
            isRequired: true,
        },
        unitType: UNIT_TYPE_FIELD,
        place: {
            schemaDoc: 'Certain place in unit where meter is, such as kitchen',
            type: Text,
        },
        resource: {
            schemaDoc: 'Meter resource, such as hot water or electricity',
            type: Relationship,
            ref: 'MeterResource',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },
        isAutomatic: {
            schemaDoc: `Determines, if Meter is automatic or not. False by default. If set to True - prevents user with type "${RESIDENT}" from creating MeterReading. So MeterReadings only be acquired through external integration or adjusted by organization employee`,
            type: Checkbox,
            isRequired: true,
            defaultValue: false,
        },
        b2cApp: {
            schemaDoc: 'Ref to the B2CApp which used to replace default integration with meter by resident\'s user in resident\'s app',
            type: Relationship,
            ref: 'B2CApp',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },
        b2bApp: {
            schemaDoc: 'Ref to B2BApp, which is used as a master system for this meter. Specified organization must connect this app.',
            type: Relationship,
            ref: 'B2BApp',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['organization', 'number', 'resource'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'meter_unique_organization_and_number',
            },
        ],
    },
    hooks: {
        validateInput: async ({ resolvedData, addValidationError, existingItem }) => {
            const newItem = { ...existingItem, ...resolvedData }
            if (newItem.isAutomatic && !newItem.b2bApp) {
                return addValidationError(AUTOMATIC_METER_NO_MASTER_APP)
            }
            if (resolvedData['b2bApp']) {
                const activeContext = await getByCondition('B2BAppContext', {
                    organization: { id: newItem.organization, deletedAt: null },
                    app: { id: newItem.b2bApp, deletedAt: null },
                    deletedAt: null,
                })
                if (!activeContext) {
                    return addValidationError(B2B_APP_NOT_CONNECTED)
                }
            }
            if (resolvedData['b2cApp']) {
                const property = await getById('Property', newItem.property)
                const address = get(property, 'address', null)
                const appProperty = await getByCondition('B2CAppProperty', {
                    deletedAt: null,
                    app: { id: newItem.b2cApp, deletedAt: null },
                    address_i: address,
                })
                if (!appProperty) {
                    return addValidationError(B2C_APP_NOT_AVAILABLE)
                }
            }
        },
        afterChange: async ({ operation, originalInput, updatedItem }) => {
            if (operation === 'update') {
                const deletedMeterAt = get(originalInput, 'deletedAt')

                if (deletedMeterAt) {
                    await deleteReadingsOfDeletedMeter.delay(updatedItem, deletedMeterAt)
                }
            }
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadMeters,
        create: access.canManageMeters,
        update: access.canManageMeters,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Meter,
}
