/**
 * Generated by `createschema banking.BankIntegrationAccessRight 'integration:Relationship:BankIntegration:PROTECT; user:Relationship:User:CASCADE;'`
 */

const { makeLoggedInAdminClient, makeClient } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const { BANK_INTEGRATION_IDS } = require('@condo/domains/banking/constants')
const { BankIntegrationAccessRight, createTestBankIntegrationAccessRight, updateTestBankIntegrationAccessRight, BankIntegration } = require('@condo/domains/banking/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser, makeClientWithServiceUser } = require('@condo/domains/user/utils/testSchema')

describe('BankIntegrationAccessRight', () => {
    let adminClient, serviceUserClient, integration
    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        serviceUserClient = await makeClientWithServiceUser()
        integration = await BankIntegration.getOne(adminClient, { id: BANK_INTEGRATION_IDS.SBBOL })
    })

    it('user: create BankIntegrationAccessRight', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestBankIntegrationAccessRight(client, integration, serviceUserClient.user)
        })
    })

    it('anonymous: create BankIntegrationAccessRight', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestBankIntegrationAccessRight(client, integration, serviceUserClient.user)
        })
    })

    it('support: create BankIntegrationAccessRight', async () => {
        const support = await makeClientWithSupportUser()
        const [integrationAccessRight] = await createTestBankIntegrationAccessRight(support, integration,  serviceUserClient.user)
        expect(integrationAccessRight).toEqual(expect.objectContaining({
            integration: { id: integration.id },
        }))
    })

    it('adminClient: create BankIntegrationAccessRight', async () => {
        const [integrationAccessRight] = await createTestBankIntegrationAccessRight(
            adminClient, integration, serviceUserClient.user)
        expect(integrationAccessRight).toEqual(expect.objectContaining({
            integration: { id: integration.id },
        }))
    })

    it('user: can read BankIntegrationAccessRight if connected to it', async () => {
        const [right] = await createTestBankIntegrationAccessRight(adminClient, integration, serviceUserClient.user)
        const [accessRight] = await BankIntegrationAccessRight.getAll(serviceUserClient, { id: right.id })

        expect(accessRight.user.id).toEqual(serviceUserClient.user.id)
    })

    it('anonymous: read BankIntegrationAccessRight', async () => {
        const [right] = await createTestBankIntegrationAccessRight(adminClient, integration, serviceUserClient.user)
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObjects(async () => {
            await BankIntegrationAccessRight.getAll(client, { id: right.id })
        })
    })

    it('user: update BankIntegrationAccessRight', async () => {
        const [objCreated] = await createTestBankIntegrationAccessRight(adminClient, integration, serviceUserClient.user)
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {}
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestBankIntegrationAccessRight(client, objCreated.id, payload)
        })
    })

    it('anonymous: update BankIntegrationAccessRight', async () => {
        const [objCreated] = await createTestBankIntegrationAccessRight(adminClient, integration, serviceUserClient.user)
        const client = await makeClient()
        const payload = {}
        await expectToThrowAuthenticationErrorToObj(async () => {
            await updateTestBankIntegrationAccessRight(client, objCreated.id, payload)
        })
    })

    it('adminClient: delete BankIntegrationAccessRight', async () => {
        const [objCreated] = await createTestBankIntegrationAccessRight(adminClient, integration, serviceUserClient.user)
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await BankIntegrationAccessRight.delete(adminClient, objCreated.id)
        })
    })
})