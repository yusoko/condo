/**
 * Generated by `createschema analytics.ExternalReport 'type:Select:metabase; title:Text; description?:Text; meta?:Json'`
 */

const { Text, Select, Checkbox } = require('@keystonejs/fields')

const { Json } = require('@open-condo/keystone/fields')
const { historical, versioned, uuided, tracked, softDeleted, dvAndSender } = require('@open-condo/keystone/plugins')
const { GQLListSchema } = require('@open-condo/keystone/schema')

const access = require('@condo/domains/analytics/access/ExternalReport')
const { EXTERNAL_REPORT_TYPES } = require('@condo/domains/analytics/constants/constants')
const { COMMON_AND_ORGANIZATION_OWNED_FIELD } = require('@condo/domains/organization/schema/fields')


const ExternalReport = new GQLListSchema('ExternalReport', {
    schemaDoc: 'External report for analytics section that could be displayed with iframe',
    fields: {
        type: {
            schemaDoc: 'Type of external report. Way to determine logic of url building process',
            type: Select,
            options: EXTERNAL_REPORT_TYPES,
            isRequired: true,
        },

        title: {
            schemaDoc: 'Report card title text',
            type: Text,
            isRequired: true,
        },

        description: {
            schemaDoc: 'Report card description',
            type: Text,
        },

        meta: {
            schemaDoc: 'Meta data for building iframe link. For example, external id or custom options that required at specified type of report',
            type: Json,
        },

        organization: COMMON_AND_ORGANIZATION_OWNED_FIELD,

        isHidden: {
            schemaDoc: 'Indicates visibility of concrete external report at ui',
            type: Checkbox,
            defaultValue: false,
            isRequired: true,
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), dvAndSender(), historical()],
    access: {
        read: access.canReadExternalReports,
        create: access.canManageExternalReports,
        update: access.canManageExternalReports,
        delete: false,
        auth: true,
    },
})

module.exports = {
    ExternalReport,
}
