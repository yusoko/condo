/**
 * Generated by `createservice analytics.GetOverviewDashboardService`
 */

const dayjs = require('dayjs')

const { GQLError, GQLErrorCode: { FORBIDDEN } } = require('@open-condo/keystone/errors')
const { GQLCustomSchema } = require('@open-condo/keystone/schema')
const { i18n } = require('@open-condo/locales/loader')

const { PAYMENT_WITHDRAWN_STATUS, PAYMENT_DONE_STATUS } = require('@condo/domains/acquiring/constants/payment')
const access = require('@condo/domains/analytics/access/GetOverviewDashboardService')
const { AnalyticsDataProvider } = require('@condo/domains/analytics/utils/services/AnalyticsDataProvider')
const { PaymentDataLoader } = require('@condo/domains/analytics/utils/services/dataLoaders/payment')
const { ReceiptDataLoader } = require('@condo/domains/analytics/utils/services/dataLoaders/receipt')
const { ResidentDataLoader } = require('@condo/domains/analytics/utils/services/dataLoaders/resident')
const { TicketDataLoader } = require('@condo/domains/analytics/utils/services/dataLoaders/ticket')
const { OPERATION_FORBIDDEN } = require('@condo/domains/common/constants/errors')
const { ANALYTICS_V3 } = require('@condo/domains/organization/constants/features')
const { Organization } = require('@condo/domains/organization/utils/serverSchema')

const ERRORS = {
    FEATURE_IS_DISABLED: {
        code: FORBIDDEN,
        type: OPERATION_FORBIDDEN,
        message: 'Your organization do not have access to this feature',
        messageForUser: 'api.analytics.overviewDashboard.FEATURE_IS_DISABLED',
    },
}

const TICKET_REMAPPING_OPTIONS = { ticketCounts: 'tickets' }
const PERIOD_FIELD_DATE_FORMAT = 'YYYY-MM-DD'


const GetOverviewDashboardService = new GQLCustomSchema('GetOverviewDashboardService', {
    types: [
        {
            access: true,
            type: 'enum GetOverviewDashboardAggregatePeriod { day week }',
        },
        {
            access: true,
            type: 'input GetOverviewDashboardGroupByInput { aggregatePeriod: GetOverviewDashboardAggregatePeriod! }',
        },
        {
            access: true,
            type: 'input GetOverviewDashboardWhereInput { organization: String!, dateFrom: String!, dateTo: String! }',
        },
        {
            access: true,
            type: 'input GetOverviewDashboardInput { dv: Int!, sender: JSON!, where: GetOverviewDashboardWhereInput!, groupBy: GetOverviewDashboardGroupByInput! }',
        },
        {
            access: true,
            type: 'type TicketOverviewResult { tickets: [TicketGroupedCounter!] }',
        },
        {
            access: true,
            type: 'type PaymentGroupedCounter { count: String!, sum: String!, createdBy: ID!, dayGroup: String! }',
        },
        {
            access: true,
            type: 'type PaymentOverviewResult { payments: [PaymentGroupedCounter!], sum: String! }',
        },
        {
            access: true,
            type: 'type ReceiptGroupedCounter { count: String!, sum: String!, dayGroup: String! }',
        },
        {
            access: true,
            type: 'type ReceiptOverviewResult { receipts: [ReceiptGroupedCounter!], sum: String! }',
        },
        {
            access: true,
            type: 'type ResidentGroupedCounter { count: String!, address: String! }',
        },
        {
            access: true,
            type: 'type ResidentOverviewResult { residents: [ResidentGroupedCounter!] }',
        },
        {
            access: true,
            type: 'type OverviewData { ticketByProperty: TicketOverviewResult, ticketByDay: TicketOverviewResult, ticketByCategory: TicketOverviewResult, ticketByExecutor: TicketOverviewResult, payment: PaymentOverviewResult, receipt: ReceiptOverviewResult, resident: ResidentOverviewResult }',
        },
        {
            access: true,
            type: 'type GetOverviewDashboardOutput { overview: OverviewData! }',
        },
    ],

    queries: [
        {
            access: access.canGetOverviewDashboard,
            schema: 'getOverviewDashboard(data: GetOverviewDashboardInput!): GetOverviewDashboardOutput',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { data: { where, groupBy } } = args

                const organization = await Organization.getOne(context, { id: where.organization })

                if (!organization.features.includes(ANALYTICS_V3)) {
                    throw new GQLError(ERRORS.FEATURE_IS_DISABLED, context)
                }

                const ticketNullReplaces = {
                    categoryClassifier: i18n('pages.condo.analytics.TicketAnalyticsPage.NullReplaces.CategoryClassifier'),
                    executor: i18n('pages.condo.analytics.TicketAnalyticsPage.NullReplaces.Executor'),
                    assignee: i18n('pages.condo.analytics.TicketAnalyticsPage.NullReplaces.Assignee'),
                }

                const dateFilter = {
                    AND: [
                        { createdAt_gte: where.dateFrom },
                        { createdAt_lte: where.dateTo },
                    ],
                }
                const ticketWhereFilter = { organization: { id: where.organization }, ...dateFilter, deletedAt: null }

                const dataProvider = new AnalyticsDataProvider({
                    entities: {
                        ticketByProperty: {
                            provider: new TicketDataLoader({ context }),
                            queryOptions: {
                                where: ticketWhereFilter,
                                groupBy: ['property', 'status'],
                                nullReplaces: ticketNullReplaces,
                            },
                            remappingOptions: TICKET_REMAPPING_OPTIONS,
                        },
                        ticketByDay: {
                            provider: new TicketDataLoader({ context }),
                            queryOptions: {
                                where: ticketWhereFilter,
                                groupBy: [groupBy.aggregatePeriod, 'status'],
                                nullReplaces: ticketNullReplaces,
                            },
                            remappingOptions: TICKET_REMAPPING_OPTIONS,
                        },
                        ticketByCategory: {
                            provider: new TicketDataLoader({ context }),
                            queryOptions: {
                                where: ticketWhereFilter,
                                groupBy: ['categoryClassifier', 'status'],
                                nullReplaces: ticketNullReplaces,
                            },
                            remappingOptions: TICKET_REMAPPING_OPTIONS,
                        },
                        ticketByExecutor: {
                            provider: new TicketDataLoader({ context }),
                            queryOptions: {
                                where: ticketWhereFilter,
                                groupBy: ['executor', 'status'],
                                nullReplaces: ticketNullReplaces,
                            },
                            remappingOptions: TICKET_REMAPPING_OPTIONS,
                        },
                        payment: {
                            provider: new PaymentDataLoader({ context }),
                            queryOptions: {
                                where: {
                                    organization: { id: where.organization },
                                    deletedAt: null,
                                    status_in: [PAYMENT_WITHDRAWN_STATUS, PAYMENT_DONE_STATUS],
                                    AND: [
                                        { period_gte: dayjs(where.dateFrom).startOf('month').format(PERIOD_FIELD_DATE_FORMAT) },
                                        { period_lte: dayjs(where.dateTo).endOf('month').format(PERIOD_FIELD_DATE_FORMAT) },
                                    ],
                                },
                                groupBy: ['month', 'createdBy'],
                            },
                        },
                        receipt: {
                            provider: new ReceiptDataLoader({ context }),
                            queryOptions: {
                                where: {
                                    organization: { id: where.organization },
                                    deletedAt: null,
                                    AND: [
                                        { period_gte: dayjs(where.dateFrom).startOf('month').format(PERIOD_FIELD_DATE_FORMAT) },
                                        { period_lte: dayjs(where.dateTo).endOf('month').format(PERIOD_FIELD_DATE_FORMAT) },
                                    ],
                                },
                                groupBy: ['month'],
                            },
                        },
                        resident: {
                            provider: new ResidentDataLoader({ context }),
                            queryOptions: {
                                where: {
                                    organization: { id: where.organization },
                                    deletedAt: null,
                                },
                                groupBy: ['address'],
                            },
                        },
                    },
                })

                const overview = await dataProvider.loadAll()

                return { overview }
            },
        },
    ],
})

module.exports = {
    GetOverviewDashboardService,
    ERRORS,
}