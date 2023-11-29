/**
 * Generated by `createservice marketplace.RegisterInvoiceService '--type=mutations' 'resident: ResidentWhereUniqueInput!, rows:[InvoiceRowSchemaFieldInput!]!'`
 */
const Big = require('big.js')
const { get, set } = require('lodash')

const conf = require('@open-condo/config')
const { GQLError, GQLErrorCode: { BAD_USER_INPUT } } = require('@open-condo/keystone/errors')
const { GQLCustomSchema, getByCondition, getById } = require('@open-condo/keystone/schema')
const { extractReqLocale } = require('@open-condo/locales/extractReqLocale')
const { i18n } = require('@open-condo/locales/loader')

const access = require('@condo/domains/marketplace/access/RegisterInvoiceService')
const {
    INVOICE_CONTEXT_STATUS_FINISHED,
    INVOICE_STATUS_DRAFT,
    INVOICE_STATUS_PUBLISHED,
    ERROR_INVOICE_EMPTY_ROWS,
    INVOICE_PAYMENT_TYPES,
} = require('@condo/domains/marketplace/constants')
const { ERROR_NO_INVOICE_CONTEXT, ERROR_ITEM_FROM_OTHER_ORGANIZATION } = require('@condo/domains/marketplace/constants')
const { Invoice, MarketPriceScope } = require('@condo/domains/marketplace/utils/serverSchema')
const { Ticket } = require('@condo/domains/ticket/utils/serverSchema')

const ERRORS = {
    NO_INVOICE_CONTEXT: {
        code: BAD_USER_INPUT,
        type: ERROR_NO_INVOICE_CONTEXT,
        message: 'The organization hasn\'t set up the marketplace',
        messageForUser: 'api.marketplace.registerInvoice.error.noInvoiceContext',
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
}

const MOBILE_APP_RESIDENT_TICKET_SOURCE_ID = '830d1d89-2d17-4c5b-96d1-21b5cd01a6d3'

const RegisterInvoiceService = new GQLCustomSchema('RegisterInvoiceService', {
    schemaDoc: 'Using by mobile application. Allows residents to create invoice in pair with related ticket.',
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
            type: 'input RegisterInvoiceInput { dv: Int!, sender: SenderFieldInput!, resident: ResidentWhereUniqueInput!, invoiceRows: [InvoiceRowsInput!]!, paymentType: InvoicePaymentType! }',
        },
        {
            access: true,
            type: 'type RegisterInvoiceOutput { invoice: Invoice! }',
        },
    ],

    mutations: [
        {
            access: access.canRegisterInvoice,
            schema: 'registerInvoice(data: RegisterInvoiceInput!): RegisterInvoiceOutput',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { data } = args
                const { dv, sender } = data
                const userId = get(context, ['authedItem', 'id'])

                const locale = extractReqLocale(context.req) || conf.DEFAULT_LOCALE

                const resident = await getByCondition('Resident', { deletedAt: null, id: data.resident.id })
                const invoiceContext = await getByCondition('InvoiceContext', {
                    deletedAt: null,
                    organization: { id: resident.organization },
                    status: INVOICE_CONTEXT_STATUS_FINISHED,
                })

                if (!invoiceContext) {
                    throw new GQLError(ERRORS.NO_INVOICE_CONTEXT, context)
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
                    currencyCode: invoiceContext.currencyCode,
                    vatPercent: get(priceScope, ['marketItemPrice', 'price', 0, 'vatPercent'], get(invoiceContext, 'vatPercent')),
                    salesTaxPercent: get(priceScope, ['marketItemPrice', 'price', 0, 'salesTaxPercent'], get(invoiceContext, 'salesTaxPercent')),
                    sku: get(priceScope, ['marketItemPrice', 'marketItem', 'sku']),
                }))

                if (rows.length === 0) {
                    throw new GQLError(ERRORS.EMPTY_ROWS, context)
                }

                // To be sure that we do not create ticket without invoice, we create invoice first
                // Then we create the ticket and connect the invoice
                const invoice = await Invoice.create(context, {
                    dv,
                    sender,
                    context: { connect: { id: invoiceContext.id } },
                    property: { connect: { id: resident.property } },
                    unitType: resident.unitType,
                    unitName: resident.unitName,
                    rows,
                    status: INVOICE_STATUS_DRAFT,
                    paymentType: data.paymentType,
                    client: { connect: { id: userId } },
                })

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

                await Invoice.update(context, invoice.id, {
                    dv,
                    sender,
                    ticket: { connect: { id: ticket.id } },
                    status: hasMinPrice ? INVOICE_STATUS_DRAFT : INVOICE_STATUS_PUBLISHED,
                })

                return { invoice: await getById('Invoice', invoice.id) }
            },
        },
    ],

})

module.exports = {
    RegisterInvoiceService,
}
