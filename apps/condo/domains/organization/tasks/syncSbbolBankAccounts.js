const { createCronTask } = require('@open-condo/keystone/tasks')
const { SBBOL_IMPORT_NAME } = require('@condo/domains/organization/integrations/sbbol/constants')
const { syncBankAccounts } = require('@condo/domains/organization/integrations/sbbol/sync/syncBankAccounts')
const { User } = require('@condo/domains/user/utils/serverSchema/index')
const { getSchemaCtx } = require('@open-condo/keystone/schema')
const { getLogger } = require('@open-condo/keystone/logging')
const { OrganizationEmployee } = require('@condo/domains/organization/utils/serverSchema')
const { checkSbbolBankIntegrationContext } = require('@condo/domains/organization/integrations/sbbol/utils/checkSbbolBankIntegrationContext')
const isEmpty = require('lodash/isEmpty')
const get = require('lodash/get')

const logger = getLogger('sbbol/syncBankAccounts')

/**
 * Syncs bank accounts with SBBOL accounts
 */
async function syncSbbolBankAccounts () {
    const { keystone: context } = await getSchemaCtx('User')
    const sbbolUsers = await User.getAll(context, {
        importRemoteSystem: SBBOL_IMPORT_NAME,
        deletedAt: null,
    })

    if (isEmpty(sbbolUsers)) return logger.info('Users imported from SBBOL not found. To do nothing')

    for await (const user of sbbolUsers) {
        const employee = await OrganizationEmployee.getOne(context, {
            user: { id: user.id },
            importRemoteSystem: SBBOL_IMPORT_NAME,
        })
        const organizationId = get(employee, 'organization.id')
        const bankIntegrationContextId = get(await checkSbbolBankIntegrationContext(context, organizationId), 'id')

        await syncBankAccounts(user.id, bankIntegrationContextId, employee.organization)
    }

}

module.exports = {
    syncSbbolBankAccountsCron: createCronTask(
        'syncSbbolBankAccountsCron',
        '0 0 * * *',
        syncSbbolBankAccounts,
        { priority: 2 }
    ),
}