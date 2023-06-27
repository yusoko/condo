/**
 * Generated by `createschema organization.Organization 'country:Select:ru,en; name:Text; description?:Text; avatar?:File; meta:Json; employees:Relationship:OrganizationEmployee:CASCADE; statusTransitions:Json; defaultEmployeeRoleStatusTransitions:Json' --force`
 */

const { File, Text, Relationship, Select, Virtual } = require('@keystonejs/fields')
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce')
const get = require('lodash/get')

const userAccess = require('@open-condo/keystone/access')
const { GQLError } = require('@open-condo/keystone/errors')
const { Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')
const { webHooked } = require('@open-condo/webhooks/plugins')

const { COUNTRIES } = require('@condo/domains/common/constants/countries')
const { PHONE_FIELD } = require('@condo/domains/common/schema/fields')
const FileAdapter = require('@condo/domains/common/utils/fileAdapter')
const { normalizePhone } = require('@condo/domains/common/utils/phone')
const access = require('@condo/domains/organization/access/Organization')
const { ORGANIZATION_TYPES, MANAGING_COMPANY_TYPE, HOLDING_TYPE } = require('@condo/domains/organization/constants/common')
const { ORGANIZATION_ERRORS } = require('@condo/domains/organization/constants/errors')
const { ORGANIZATION_FEATURES_FIELD } = require('@condo/domains/organization/schema/fields/features')
const { isValidTin } = require('@condo/domains/organization/utils/tin.utils')
const { COUNTRY_RELATED_STATUS_TRANSITIONS } = require('@condo/domains/ticket/constants/statusTransitions')

const AVATAR_FILE_ADAPTER = new FileAdapter('orgavatars')

const Organization = new GQLListSchema('Organization', {
    schemaDoc: 'B2B customer of the service, a legal entity or an association of legal entities (holding/group)',
    fields: {
        country: {
            schemaDoc: 'Country level specific',
            isRequired: true,
            type: Select,
            options: Object.keys(COUNTRIES).join(','),
        },
        name: {
            schemaDoc: 'Customer-friendly name',
            type: Text,
            isRequired: true,
            kmigratorOptions: { null: false },
        },
        type: {
            schemaDoc: 'Type of organization. Organizations with different types see slightly different interfaces. ' +
                'In addition, some of the logic depends on this field: ' +
                `1. Residents can be connected to only "${MANAGING_COMPANY_TYPE}" organization` +
                `2. OrganizationLink cannot be created if parent organization is not "${HOLDING_TYPE}"`,
            type: Select,
            options: ORGANIZATION_TYPES,
            dataType: 'string',
            defaultValue: MANAGING_COMPANY_TYPE,
            isRequired: true,
            kmigratorOptions: { null: false },
            access: {
                read: true,
                create: true,
                update: userAccess.userIsAdminOrIsSupport,
            },
        },
        // The reason for this field is to avoid adding check for resident user into global Organization read access.
        // This field have specific use case for mobile client.
        tin: {
            schemaDoc: 'Taxpayer identification number. Every country has its own identification. Examples: INN for Russia, IIN for Kazakhstan and so on',
            type: Text,
            isRequired: false,
            kmigratorOptions: { null: true },
            access: true,
            hooks: {
                validateInput: async ({ resolvedData, addFieldValidationError, existingItem })  => {
                    const item = resolvedData

                    const country = get(item, 'country') || get(existingItem, 'country')
                    const tin = get(item, 'tin')

                    if (!country || !tin) {
                        addFieldValidationError('Country and Tin fields can not be empty')
                    }

                    if (!isValidTin(tin, country)) {
                        addFieldValidationError('Tin field has not a valid values supplied')
                    }
                },
            },
        },
        description: {
            schemaDoc: 'Customer-friendly description. Friendly text for employee and resident users',
            type: Wysiwyg,
            isRequired: false,
        },
        avatar: {
            schemaDoc: 'Customer-friendly avatar',
            type: File,
            isRequired: false,
            adapter: AVATAR_FILE_ADAPTER,
        },
        meta: {
            schemaDoc: 'Organization metadata. Depends on country level specific' +
                'Example of data key: `kpp`',
            type: Json,
            isRequired: false,
        },
        phone: {
            ...PHONE_FIELD,
            schemaDoc: 'Normalized organization phone in E.164 format without spaces',
        },
        phoneNumberPrefix: {
            schemaDoc: `Numeric identifier assigned to a specific line in software for calling. 
            Used when outgoing call before the number to be called. 
            For example phoneNumberPrefix = 01, then the result phone number to be called = 01{phone number}.`,
            type: Text,
        },
        employees: {
            type: Relationship,
            ref: 'OrganizationEmployee.organization',
            many: true,
            access: { create: false, update: false },
        },
        relatedOrganizations: {
            type: Relationship,
            ref: 'OrganizationLink.to',
            many: true,
            access: { create: false, update: false },
        },
        statusTransitions: {
            schemaDoc: 'Graph of possible transitions for statuses. If there is no transition in this graph, ' +
                'it is impossible to change status if the user in the role has the right to do so.',
            type: Virtual,
            graphQLReturnType: 'JSON',
            resolver: (organization) => {
                const organizationCountry = get(organization, 'country', 'en')

                return COUNTRY_RELATED_STATUS_TRANSITIONS[organizationCountry]
            },
        },
        defaultEmployeeRoleStatusTransitions: {
            schemaDoc: 'Default employee role status transitions map which will be used as fallback for status transition validation' +
                'if user dont have OrganizationEmployeeRole',
            type: Virtual,
            graphQLReturnType: 'JSON',
            resolver: (organization) => {
                const organizationCountry = get(organization, 'country', 'en')

                return COUNTRY_RELATED_STATUS_TRANSITIONS[organizationCountry]
            },
        },
        importRemoteSystem: {
            schemaDoc: 'External provider for organization',
            type: Text,
            access: access.canAccessToImportField,
            kmigratorOptions: { null: true, unique: false },
        },
        importId: {
            schemaDoc: 'External system organization id. Used for integrations',
            type: Text,
            access: access.canAccessToImportField,
            kmigratorOptions: { null: true, unique: false },
        },
        features: ORGANIZATION_FEATURES_FIELD,
    },
    kmigratorOptions: {
        constraints: [
            {
                type: 'models.UniqueConstraint',
                fields: ['importId', 'importRemoteSystem'],
                condition: 'Q(deletedAt__isnull=True)',
                name: 'unique_organization_importid_and_importremotesystem',
            },
        ],
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical(), webHooked()],
    access: {
        read: access.canReadOrganizations,
        create: access.canManageOrganizations,
        update: access.canManageOrganizations,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Organization,
}
