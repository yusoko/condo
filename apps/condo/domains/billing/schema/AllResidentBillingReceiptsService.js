/**
 * Generated by `createservice billing.BillingReceiptsService --type queries`
 */

const { ServiceConsumer } = require('@condo/domains/resident/utils/serverSchema')
const { BillingReceipt } = require('@condo/domains/billing/utils/serverSchema')
const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('../access/AllResidentBillingReceipts')
const { generateQuerySortBy } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { generateQueryWhereInput } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { pick, get } = require('lodash')

const fieldsObj = {
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
            type: generateQueryWhereInput('ResidentBillingReceipt', fieldsObj),
        },
        {
            access: true,
            type: generateQuerySortBy('ResidentBillingReceipt', Object.keys(fieldsObj)),
        },
        {
            access: true,
            type: 'type ResidentBillingReceiptOutput { dv: String!, recipient: JSON!, id: ID!, period: String!, toPay: String!, printableNumber: String, toPayDetails: JSON, services: JSON, serviceConsumer: ServiceConsumer! }',
        },
    ],
    
    queries: [
        {
            access: access.canGetAllResidentBillingReceipts,
            schema: 'allResidentBillingReceipts (where: ResidentBillingReceiptWhereInput, first: Int, skip: Int, sortBy: [SortResidentBillingReceiptsBy!]): [ResidentBillingReceiptOutput]',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { where, first, skip, sortBy } = args

                const serviceConsumerWhere = pick(where, 'serviceConsumer')
                const receiptsWhere = pick(where, ['id', 'period', 'toPay', 'printableNumber'])

                const userId = get(context, ['authedItem', 'id'])
                if (!userId) { // impossible, but who knows
                    throw new Error('Invalid user id!')
                }

                const serviceConsumers = await ServiceConsumer.getAll(context, serviceConsumerWhere)
                if (!Array.isArray(serviceConsumers) || !serviceConsumers.length) {
                    throw new Error('No serviceConsumers found for this user!')
                }

                const billingReceipts = []
                for (let i = 0; i < serviceConsumers.length; ++i) {
                    const receiptsQuery = { ...receiptsWhere, account: { id: serviceConsumers[i].billingAccount.id } }
                    
                    const billingReceiptsForConsumer = await BillingReceipt.getAll(
                        context,
                        receiptsQuery,
                        {
                            sortBy, first, skip,
                        }
                    )

                    billingReceipts.push(
                        billingReceiptsForConsumer.map(
                            receipt => ({
                                id: receipt.id,
                                dv: receipt.dv,
                                recipient: receipt.recipient,
                                period: receipt.period,
                                toPay: receipt.toPay,
                                toPayDetails: receipt.toPayDetails,
                                services: receipt.services,
                                printableNumber: receipt.printableNumber,
                                serviceConsumer: serviceConsumers[i],
                            })
                        ))
                }

                return billingReceipts.flat()
            },
        },
    ],
})

module.exports = {
    GetAllResidentBillingReceiptsService,
}
