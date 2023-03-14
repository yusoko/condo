const dayjs = require('dayjs')
const { get } = require('lodash')
const { v4: uuid } = require('uuid')

const { getLogger } = require('@open-condo/keystone/logging')
const { getSchemaCtx } = require('@open-condo/keystone/schema')
const { createCronTask } = require('@open-condo/keystone/tasks')

const {
    dvAndSender,
    paginationConfiguration,
} = require('@condo/domains/acquiring/tasks/utils/constants')
const {
    getAllReadyToPayRecurrentPaymentContexts,
    getReceiptsForServiceConsumer,
} = require('@condo/domains/acquiring/tasks/utils/queries')
const {
    RecurrentPayment,
} = require('@condo/domains/acquiring/utils/serverSchema')
const { processArrayOf } = require('@condo/domains/common/utils/parallel')

const logger = getLogger('recurrent-payment-context-processing')

async function processContext (context, date, recurrentPaymentContext) {
    // prepare vars
    const { serviceConsumer, billingCategory } = recurrentPaymentContext
    const previousMonthDate = date.startOf('month').subtract(1, 'days')

    // get billing receipts
    const billingReceipts = await getReceiptsForServiceConsumer(
        context,
        previousMonthDate,
        serviceConsumer,
        billingCategory,
    )

    // no receipts == no payment tasks
    if (billingReceipts.length === 0) {
        return
    }

    // create payment proceeding tasks
    return await RecurrentPayment.create(context, {
        ...dvAndSender,
        tryCount: 0,
        state: {},
        billingReceipts: billingReceipts.map(receipt => ({ id: receipt.id })),
        recurrentPaymentContext: { connect: { id: recurrentPaymentContext.id } },
    })
}

async function process () {
    const jobId = uuid()
    logger.info({ msg: 'Start processing recurrent payment context', jobId})

    // prepare context
    const { keystone } = await getSchemaCtx('RecurrentPaymentContext')
    const context = await keystone.createContext({ skipAccessControl: true })

    // prepare vars
    const date = dayjs()
    const { pageSize } = paginationConfiguration
    let offset = 0
    let hasMorePages = true

    // retrieve RecurrentPaymentContext page by page
    while (hasMorePages) {
        logger.info({ msg: `Processing recurrent payment context page #${Math.floor(offset / pageSize)}`, jobId})

        // get page (can be empty)
        const page = await getAllReadyToPayRecurrentPaymentContexts(context, date, pageSize, offset)

        // process each page in parallel
        await processArrayOf(page).inParallelWith(async (recurrentPaymentContext) => {
            try {
                await processContext(context, date, recurrentPaymentContext)
            } catch (error) {
                const message = get(error, 'errors[0].message') || get(error, 'message') || JSON.stringify(error)
                logger.error({ msg: 'Process recurrent payment context error', message, jobId })
            }
        })

        hasMorePages = page.length > 0
        offset += pageSize
    }
    logger.info({ msg: 'End processing recurrent payment context', jobId})
}

module.exports = {
    process,
    processContext,
    recurrentPaymentsContextProcessingCron: createCronTask('recurrentPaymentsContextProcessing', '0 * * * *', process),
}