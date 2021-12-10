/**
 * Generated by `createservice billing.BillingReceiptsService --type queries`
 */

const { pick, get } = require('lodash')
const Big = require('big.js')

const { ServiceConsumer } = require('@condo/domains/resident/utils/serverSchema')
const { Payment } = require('@condo/domains/acquiring/utils/serverSchema')

const { BillingReceipt } = require('../utils/serverSchema')
const access = require('../access/AllResidentBillingReceipts')
const { PAYMENT_DONE_STATUS } = require('@condo/domains/acquiring/constants/payment')
const {
    BILLING_RECEIPT_RECIPIENT_FIELD_NAME,
    BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME,
    BILLING_RECEIPT_SERVICES_FIELD,
} = require('../constants/constants')
const { generateQuerySortBy } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { generateQueryWhereInput } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const { GQLCustomSchema } = require('@core/keystone/schema')


/**
 * Sums all DONE payments for billingReceipt for <organization> with <accountNumber> and <period>
 * @param context {Object}
 * @param organizationId {string}
 * @param accountNumber {string}
 * @param period {string}
 * @return {Promise<*>}
 */
const getPaymentsSum = async (context, organizationId, accountNumber, period) => {
    const payments = await Payment.getAll(
        context,
        {
            organization: { id: organizationId },
            accountNumber: accountNumber,
            period: period,
            status: PAYMENT_DONE_STATUS,
        }
    )
    return payments.reduce((total, current) => (Big(total).plus(current.amount)), 0).toFixed(8).toString()
}


const ALL_RESIDENT_BILLING_RECEIPTS_FIELDS = {
    id: 'ID',
    period: 'String',
    toPay: 'String',
    printableNumber: 'String',
    serviceConsumer: 'ServiceConsumer',
}


const GetAllResidentBillingReceiptsService = new GQLCustomSchema('GetAllResidentBillingReceiptsService', {
    types: [
        {
            access: true,
            type: generateQueryWhereInput('ResidentBillingReceipt', ALL_RESIDENT_BILLING_RECEIPTS_FIELDS),
        },
        {
            access: true,
            type: generateQuerySortBy('ResidentBillingReceipt', Object.keys(ALL_RESIDENT_BILLING_RECEIPTS_FIELDS)),
        },
        {
            access: true,
            type: `type ResidentBillingReceiptOutput { dv: String!, recipient: ${BILLING_RECEIPT_RECIPIENT_FIELD_NAME}!, id: ID!, period: String!, toPay: String!, paid: String!, printableNumber: String, toPayDetails: ${BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME}, services: ${BILLING_RECEIPT_SERVICES_FIELD}, serviceConsumer: ServiceConsumer! currencyCode: String! }`,
        },
    ],
    
    queries: [
        {
            access: access.canGetAllResidentBillingReceipts,
            schema: 'allResidentBillingReceipts (where: ResidentBillingReceiptWhereInput, first: Int, skip: Int, sortBy: [SortResidentBillingReceiptsBy!]): [ResidentBillingReceiptOutput]',
            resolver: async (parent, args, context = {}) => {
                const { where, first, skip, sortBy } = args

                const serviceConsumerWhere = get(where, 'serviceConsumer', {})
                const receiptsWhere = pick(where, ['id', 'period', 'toPay', 'printableNumber'])

                const userId = get(context, ['authedItem', 'id'])
                if (!userId) { // impossible, but who knows
                    throw new Error('Invalid user id!')
                }

                // We can't really use getting service consumer with all access here, since we do not show billingAccount to our user
                const GET_ONLY_OWN_SERVICE_CONSUMER_WHERE = { user: { id: userId } }
                if (!serviceConsumerWhere.resident) {
                    serviceConsumerWhere.resident = GET_ONLY_OWN_SERVICE_CONSUMER_WHERE
                    serviceConsumerWhere.deletedAt = null
                } else {
                    serviceConsumerWhere.resident.user = GET_ONLY_OWN_SERVICE_CONSUMER_WHERE.user
                    serviceConsumerWhere.deletedAt = null
                }

                const serviceConsumers = (await ServiceConsumer.getAll(context, serviceConsumerWhere))
                    .filter(consumer => get(consumer, ['billingAccount', 'id']))
                if (!Array.isArray(serviceConsumers) || !serviceConsumers.length) {
                    return []
                }

                const processedReceipts = []
                for (const serviceConsumer of serviceConsumers) {

                    const receiptsQuery = { ...receiptsWhere, ...{ account: { id: serviceConsumer.billingAccount.id } }, deletedAt: null }
                    const receiptsForConsumer = await BillingReceipt.getAll(
                        context,
                        receiptsQuery,
                        {
                            sortBy, first, skip,
                        }
                    )

                    receiptsForConsumer.forEach(receipt => processedReceipts.push({
                        id: receipt.id,
                        dv: receipt.dv,
                        recipient: receipt.recipient,
                        period: receipt.period,
                        toPay: receipt.toPay,
                        toPayDetails: receipt.toPayDetails,
                        services: receipt.services,
                        printableNumber: receipt.printableNumber,
                        serviceConsumer: serviceConsumer,
                        currencyCode: get(receipt, ['context', 'integration', 'currencyCode'], null),
                    }))
                }


                const receiptsWithPayments = []
                for (const processedReceipt of processedReceipts) {

                    const organizationId = get(processedReceipt.serviceConsumer, ['organization', 'id'])
                    const accountNumber = get(processedReceipt.serviceConsumer, ['accountNumber'])

                    receiptsWithPayments.push(({
                        ...processedReceipt,
                        paid: await getPaymentsSum(context, organizationId, accountNumber, processedReceipt.period),
                    }))
                }

                return receiptsWithPayments
            },
        },
    ],
})

module.exports = {
    GetAllResidentBillingReceiptsService,
}
