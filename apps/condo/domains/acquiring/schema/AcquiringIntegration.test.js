/**
 * Generated by `createschema acquiring.AcquiringIntegration 'name:Text;'`
 */

const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')

const { AcquiringIntegration, createTestAcquiringIntegration, updateTestAcquiringIntegration } = require('@condo/domains/acquiring/utils/testSchema')
const { createTestBillingIntegration } = require('@condo/domains/billing/utils/testSchema')
const {
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowValidationFailureError,
} = require('@condo/domains/common/utils/testSchema')
const { INTEGRATION_NO_BILLINGS_ERROR } = require('@condo/domains/acquiring/constants/errors')

describe('AcquiringIntegration', () => {
    describe('CRUD', () => {
        describe('create',  () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAcquiringIntegration(client, [billingIntegration])
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const anonymousClient = await makeClient()
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAcquiringIntegration(anonymousClient, [billingIntegration])
                })
            })
            test('support can', async () => {
                const support = await makeClientWithSupportUser()
                const [billingIntegration] = await createTestBillingIntegration(support)
                const [integration, attrs] = await createTestAcquiringIntegration(support, [billingIntegration])
                expect(integration).toEqual(expect.objectContaining({
                    name: attrs.name,
                    supportedBillingIntegrations: expect.arrayContaining([
                        { id: billingIntegration.id },
                    ]),
                }))
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [secondBillingIntegration] = await createTestBillingIntegration(admin)
                const [integration, attrs] = await createTestAcquiringIntegration(admin, [billingIntegration, secondBillingIntegration], { canGroupReceipts: true })
                expect(integration).toEqual(expect.objectContaining({
                    name: attrs.name,
                    canGroupReceipts: true,
                    supportedBillingIntegrations: expect.arrayContaining([
                        { id: billingIntegration.id },
                        { id: secondBillingIntegration.id },
                    ]),
                }))
            })
        })
        describe('read', () => {
            test('user can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                await createTestAcquiringIntegration(admin, [billingIntegration])

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                const integrations = await AcquiringIntegration.getAll(client)
                expect(integrations).toBeDefined()
                expect(integrations).not.toHaveLength(0)
            })
            test('anonymous can\'t', async () => {
                const anonymousClient = await makeClient()
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await AcquiringIntegration.getAll(anonymousClient)
                })
            })
            test('support can', async () => {
                const support = await makeClientWithSupportUser()
                const [billingIntegration] = await createTestBillingIntegration(support)
                await createTestAcquiringIntegration(support, [billingIntegration])

                const integrations = await AcquiringIntegration.getAll(support)
                expect(integrations).toBeDefined()
                expect(integrations).not.toHaveLength(0)
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                await createTestAcquiringIntegration(admin, [billingIntegration])

                const integrations = await AcquiringIntegration.getAll(admin)
                expect(integrations).toBeDefined()
                expect(integrations).not.toHaveLength(0)
            })
        })
        describe('update',  () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                const payload = {}
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAcquiringIntegration(client, integration.id, payload)
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const anonymousClient = await makeClient()
                const payload = {}
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAcquiringIntegration(anonymousClient, integration.id, payload)
                })
            })
            test('support can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const support = await makeClientWithSupportUser()
                const newName = 'UPDATE ACQUIRING TEST'
                const payload = { name: newName }
                const [newIntegration] = await updateTestAcquiringIntegration(support, integration.id, payload)
                expect(newIntegration).toEqual(expect.objectContaining(payload))
            })
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const newName = 'UPDATE ACQUIRING TEST'
                const payload = { name: newName }
                const [newIntegration] = await updateTestAcquiringIntegration(admin, integration.id, payload)
                expect(newIntegration).toEqual(expect.objectContaining(payload))
            })
        })
        describe('hard delete',  () => {
            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const client = await makeClientWithNewRegisteredAndLoggedInUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegration.delete(client, integration.id)
                })
            })
            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const anonymousClient = await makeClient()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegration.delete(anonymousClient, integration.id)
                })
            })
            test('support can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                const support = await makeClientWithSupportUser()
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegration.delete(support, integration.id)
                })
            })
            test('admin can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [billingIntegration] = await createTestBillingIntegration(admin)
                const [integration] =  await createTestAcquiringIntegration(admin, [billingIntegration])

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await AcquiringIntegration.delete(admin, integration.id)
                })
            })
        })
    })
    describe('Validation tests', () => {
        test('Should have correct dv field (=== 1)', async () => {
            const admin = await makeLoggedInAdminClient()
            const [billingIntegration] = await createTestBillingIntegration(admin)
            await expectToThrowValidationFailureError(async () => {
                await createTestAcquiringIntegration(admin, [billingIntegration], {
                    dv: 2,
                }, 'unknownDataVersion')
            })
            const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
            await expectToThrowValidationFailureError(async () => {
                await updateTestAcquiringIntegration(admin, integration.id, {
                    dv: 2,
                })
            }, 'unknownDataVersion')
        })
        test('Can\'t exist without receipt source (billing integrations)', async () => {
            const admin = await makeLoggedInAdminClient()
            const [billingIntegration] = await createTestBillingIntegration(admin)
            await expectToThrowValidationFailureError(async () => {
                await createTestAcquiringIntegration(admin, [])
            }, INTEGRATION_NO_BILLINGS_ERROR)
            const [integration] = await createTestAcquiringIntegration(admin, [billingIntegration])
            await expectToThrowValidationFailureError(async () => {
                await updateTestAcquiringIntegration(admin, integration.id, {
                    supportedBillingIntegrations: { disconnectAll: true },
                })
            })
        })
    })
})
