/**
 * Generated by `createservice marketplace.RegisterInvoiceService '--type=mutations' 'resident: ResidentWhereUniqueInput!, rows:[InvoiceRowSchemaFieldInput!]!'`
 */
const { get, set } = require('lodash')

const conf = require('@open-condo/config')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-condo/keystone/errors')
const { GQLCustomSchema, getByCondition, getById, find } = require('@open-condo/keystone/schema')
const { extractReqLocale } = require('@open-condo/locales/extractReqLocale')
const { i18n } = require('@open-condo/locales/loader')

const { CONTEXT_FINISHED_STATUS } = require('@condo/domains/acquiring/constants/context')
const {
    INVOICE_STATUS_DRAFT,
    INVOICE_STATUS_PUBLISHED,
    ERROR_INVOICE_EMPTY_ROWS,
    INVOICE_PAYMENT_TYPES,
    DEFAULT_INVOICE_CURRENCY_CODE,
    ERROR_PROHIBITED_INVOICE_PAYMENT_TYPE,
} = require('@condo/domains/marketplace/constants')
const {
    ERROR_NO_ACQUIRING_CONTEXT,
    ERROR_ITEM_FROM_OTHER_ORGANIZATION,
} = require('@condo/domains/marketplace/constants')
const { Invoice, MarketPriceScope, MarketSetting } = require('@condo/domains/marketplace/utils/serverSchema')
const access = require('@condo/domains/resident/access/RegisterResidentInvoiceService')
const { Ticket } = require('@condo/domains/ticket/utils/serverSchema')

const ERRORS = {
    NO_ACQUIRING_CONTEXT: {
        code: BAD_USER_INPUT,
        type: ERROR_NO_ACQUIRING_CONTEXT,
        message: 'The organization hasn\'t set up the marketplace',
        messageForUser: 'api.marketplace.registerInvoice.error.noAcquiringContext',
    },
    ITEM_FROM_OTHER_ORGANIZATION: (rowNumber) => ({
        code: BAD_USER_INPUT,
        type: ERROR_ITEM_FROM_OTHER_ORGANIZATION,
        message: `Item from other organization. Check line ${rowNumber}`,
        messageForUser: 'api.marketplace.registerInvoice.error.itemFromOtherOrganization',
        messageInterpolation: { rowNumber },
    }),
    EMPTY_ROWS: {
        code: BAD_USER_INPUT,
        type: ERROR_INVOICE_EMPTY_ROWS,
        message: 'The invoice contains no rows',
        messageForUser: 'api.marketplace.invoice.error.emptyRows',
    },
    PROHIBITED_INVOICE_PAYMENT_TYPE: {
        code: BAD_USER_INPUT,
        type: ERROR_PROHIBITED_INVOICE_PAYMENT_TYPE,
        message: 'This payment method is prohibited in the selected organization',
        messageForUser: 'api.marketplace.invoice.error.prohibitedPaymentType',
    },
}

const MOBILE_APP_RESIDENT_TICKET_SOURCE_ID = '3068d49a-a45c-4c3a-a02d-ea1a53e1febb'

const RegisterResidentInvoiceService = new GQLCustomSchema('RegisterResidentInvoiceService', {
    types: [
        {
            access: true,
            type: `enum InvoicePaymentType { ${INVOICE_PAYMENT_TYPES.join(' ')} }`,
        },
        {
            access: true,
            type: 'input InvoiceRowsInput { priceScope: MarketPriceScopeWhereUniqueInput!, count: Int! }',
        },
        {
            access: true,
            type: 'input RegisterResidentInvoiceInput { dv: Int!, sender: SenderFieldInput!, resident: ResidentWhereUniqueInput!, invoiceRows: [InvoiceRowsInput!]!, paymentType: InvoicePaymentType! }',
        },
    ],

    mutations: [
        {
            access: access.canRegisterResidentInvoice,
            schemaDoc: 'Using by mobile application. Allows residents to create invoice in pair with related ticket.',
            schema: 'registerResidentInvoice(data: RegisterResidentInvoiceInput!): Invoice',
            resolver: async (parent, args, context) => {
                const { data } = args
                const { dv, sender } = data
                const userId = get(context, ['authedItem', 'id'])

                const locale = extractReqLocale(context.req) || conf.DEFAULT_LOCALE

                const resident = await getByCondition('Resident', { deletedAt: null, id: data.resident.id })

                const [acquiringContext] = await find('AcquiringIntegrationContext', {
                    organization: { id: resident.organization },
                    invoiceStatus: CONTEXT_FINISHED_STATUS,
                    deletedAt: null,
                })

                if (!acquiringContext) {
                    throw new GQLError(ERRORS.NO_ACQUIRING_CONTEXT, context)
                }

                const [marketSetting] = await MarketSetting.getAll(context, {
                    organization: { id: resident.organization },
                    deletedAt: null,
                }, { first: 1 })

                if (resident && marketSetting && !get(marketSetting, 'residentAllowedPaymentTypes', []).includes(data.paymentType)) {
                    throw new GQLError(ERRORS.PROHIBITED_INVOICE_PAYMENT_TYPE, context)
                }

                const priceScopesCounts = {}
                const priceScopesIds = data.invoiceRows.map((row) => {
                    const id = get(row, ['priceScope', 'id'])
                    set(priceScopesCounts, id, get(row, 'count', 0))

                    return id
                })

                const priceScopes = await MarketPriceScope.getAll(context, { deletedAt: null, id_in: priceScopesIds })

                for (let i = 0; i < priceScopes.length; i++) {
                    if (get(priceScopes, [i, 'marketItemPrice', 'marketItem', 'organization', 'id']) !== resident.organization) {
                        throw new GQLError(ERRORS.ITEM_FROM_OTHER_ORGANIZATION(i + 1), context)
                    }
                }

                const hasMinPrice = priceScopes.some((priceScope) => get(priceScope, ['marketItemPrice', 'price', 0, 'isMin'], false))

                const rows = priceScopes.map((priceScope) => ({
                    name: get(priceScope, ['marketItemPrice', 'marketItem', 'name']),
                    toPay: get(priceScope, ['marketItemPrice', 'price', 0, 'price']),
                    isMin: get(priceScope, ['marketItemPrice', 'price', 0, 'isMin']),
                    count: get(priceScopesCounts, get(priceScope, 'id'), 0),
                    currencyCode: DEFAULT_INVOICE_CURRENCY_CODE,
                    vatPercent: get(priceScope, ['marketItemPrice', 'price', 0, 'vatPercent'], get(acquiringContext, 'invoiceVatPercent')) || '',
                    salesTaxPercent: get(priceScope, ['marketItemPrice', 'price', 0, 'salesTaxPercent'], get(acquiringContext, 'invoiceSalesTaxPercent')) || '',
                    sku: get(priceScope, ['marketItemPrice', 'marketItem', 'sku']),
                }))

                if (rows.length === 0) {
                    throw new GQLError(ERRORS.EMPTY_ROWS, context)
                }

                const ticket = await Ticket.create(context, {
                    dv,
                    sender,
                    organization: { connect: { id: resident.organization } },
                    client: { connect: { id: userId } },
                    details: i18n('marketplace.invoice.newTicket.details', { locale }),
                    isPayable: true,
                    isResidentTicket: true,
                    canReadByResident: true,
                    property: { connect: { id: resident.property } },
                    unitType: resident.unitType,
                    unitName: resident.unitName,
                    source: { connect: { id: MOBILE_APP_RESIDENT_TICKET_SOURCE_ID } },
                })
                const invoice = await Invoice.create(context, {
                    dv,
                    sender,
                    organization: { connect: { id: resident.organization } },
                    property: { connect: { id: resident.property } },
                    unitType: resident.unitType,
                    unitName: resident.unitName,
                    rows,
                    ticket: { connect: { id: ticket.id } },
                    status: hasMinPrice ? INVOICE_STATUS_DRAFT : INVOICE_STATUS_PUBLISHED,
                    paymentType: data.paymentType,
                    client: { connect: { id: userId } },
                })

                return await getById('Invoice', invoice.id)
            },
        },
    ],

})

module.exports = {
    RegisterResidentInvoiceService,
}
