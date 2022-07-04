/**
 * Generated by `createschema billing.BillingAccount 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; bindingId:Text; number:Text; unit:Text; raw:Json; meta:Json'`
 */
const faker = require('faker')
const dayjs = require('dayjs')
const {
    makeServiceUserForIntegration,
    makeOrganizationIntegrationManager,
    makeContextWithOrganizationAndIntegrationAsAdmin,
    createReceiptsReader,
    createTestBillingProperty,
    BillingAccount,
    createTestBillingAccount,
    createTestBillingAccounts,
    updateTestBillingAccount,
    updateTestBillingAccounts,
} = require('@condo/domains/billing/utils/testSchema')
const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@condo/domains/user/utils/testSchema')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowAccessDeniedErrorToObjects,
    expectToThrowInternalError,
} = require('@condo/domains/common/utils/testSchema')
const { makeClient } = require('@core/keystone/test.utils')

describe('BillingAccount', () => {
    let admin
    let support
    let anonymous
    let user
    let context
    let property
    let integrationUser
    let integrationManager
    let anotherContext
    let anotherProperty
    beforeAll(async () => {
        const { admin: adminClient, context: billingContext, integration } = await makeContextWithOrganizationAndIntegrationAsAdmin()
        admin = adminClient
        context = billingContext
        const [firstProperty] = await createTestBillingProperty(admin, context)
        property = firstProperty
        integrationUser = await makeServiceUserForIntegration(integration)
        support = await makeClientWithSupportUser()
        const { context: secondContext } = await makeContextWithOrganizationAndIntegrationAsAdmin()
        anotherContext = secondContext
        const [secondProperty] = await createTestBillingProperty(admin, context)
        anotherProperty = secondProperty
        anonymous = await makeClient()
        user = await makeClientWithNewRegisteredAndLoggedInUser()
        const { managerUserClient } = await makeOrganizationIntegrationManager(context)
        integrationManager = managerUserClient
    })
    describe('CRUD', () => {
        describe('Create', () => {
            describe('Single object', () => {
                test('Admin can', async () => {
                    const [account] = await createTestBillingAccount(admin, context, property)
                    expect(account).toBeDefined()
                    expect(account).toHaveProperty(['context', 'id'], context.id)
                    expect(account).toHaveProperty(['property', 'id'], property.id)
                })
                test('Support cannot', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestBillingAccount(support, context, property)
                    })
                })
                describe('User', () => {
                    describe('Integration account', () => {
                        test('Can if linked to permitted integration and property via context', async () => {
                            const [account] = await createTestBillingAccount(integrationUser, context, property)
                            expect(account).toBeDefined()
                            expect(account).toHaveProperty(['context', 'id'], context.id)
                            expect(account).toHaveProperty(['property', 'id'], property.id)
                        })
                        test('Cannot otherwise', async () => {
                            await expectToThrowAccessDeniedErrorToObj(async () => {
                                await createTestBillingAccount(integrationUser, anotherContext, anotherProperty)
                            })
                        })
                    })
                    test('Integration manager cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await createTestBillingAccount(integrationManager, context, property)
                        })
                    })
                    test('Other users cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await createTestBillingAccount(user, anotherContext, anotherProperty)
                        })
                    })
                })
                test('Anonymous cannot', async () => {
                    await expectToThrowAuthenticationErrorToObj(async () => {
                        await createTestBillingAccount(anonymous, anotherContext, anotherProperty)
                    })
                })
            })
            describe('Multiple objects', () => {
                test('Admin can for any context', async () => {
                    const [accounts] = await createTestBillingAccounts(admin,
                        [context, anotherContext],
                        [property, anotherProperty])
                    expect(accounts).toBeDefined()
                    expect(accounts).toHaveLength(2)
                    expect(accounts).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            context: expect.objectContaining({ id: context.id }),
                            property: expect.objectContaining({ id: property.id }),
                        }),
                        expect.objectContaining({
                            context: expect.objectContaining({ id: anotherContext.id }),
                            property: expect.objectContaining({ id: anotherProperty.id }),
                        }),
                    ]))
                })
                test('Support cannot', async () => {
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await createTestBillingAccounts(support, [context], [property])
                    })
                })
                describe('User', () => {
                    describe('Integration account can if linked to permitted integration and property via context', () => {
                        test('All permitted contexts should pass', async () => {
                            const [accounts] = await createTestBillingAccounts(integrationUser,
                                [context, context],
                                [property, property])
                            expect(accounts).toBeDefined()
                            expect(accounts).toHaveLength(2)
                            expect(accounts[0]).toEqual(expect.objectContaining({
                                context: expect.objectContaining({ id: context.id }),
                                property: expect.objectContaining({ id: property.id }),
                            }))
                            expect(accounts[1]).toEqual(expect.objectContaining({
                                context: expect.objectContaining({ id: context.id }),
                                property: expect.objectContaining({ id: property.id }),
                            }))
                        })
                        test('Partly permitted must fail', async () => {
                            await expectToThrowAccessDeniedErrorToObjects(async () => {
                                await createTestBillingAccounts(integrationUser, [context, anotherContext], [property, property])
                            })
                        })
                    })
                    test('Integration manager cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObjects(async () => {
                            await createTestBillingAccounts(integrationManager, [context], [property])
                        })
                    })
                    test('Other users cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObjects(async () => {
                            await createTestBillingAccounts(user, [context], [property])
                        })
                    })
                })
                test('Anonymous cannot', async () => {
                    await expectToThrowAuthenticationErrorToObjects(async () => {
                        await createTestBillingAccounts(anonymous, [anotherContext], [anotherProperty])
                    })
                })
            })
        })
        describe('Update', () => {
            let account
            beforeAll(async () => {
                [account] = await createTestBillingAccount(admin, context, property)
            })
            describe('Single object', () => {
                let payload
                beforeEach(() => {
                    payload = {
                        unitName:  faker.lorem.word(),
                        fullName: faker.name.firstName(),
                    }
                })
                test('Admin can', async () => {
                    const [updatedAccount] = await updateTestBillingAccount(admin, account.id, payload)
                    expect(updatedAccount).toBeDefined()
                    expect(updatedAccount).toEqual(expect.objectContaining(payload))
                })
                test('Support cannot', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestBillingAccount(support, account.id, payload)
                    })
                })
                describe('User', () => {
                    describe('Integration account', () => {
                        test('Can if linked to permitted integration via context', async () => {
                            const [updatedAccount] = await updateTestBillingAccount(integrationUser, account.id, payload)
                            expect(updatedAccount).toBeDefined()
                            expect(updatedAccount).toEqual(expect.objectContaining(payload))
                        })
                        test('Cannot otherwise', async () => {
                            const [anotherAccount] = await createTestBillingAccount(admin, anotherContext, anotherProperty)
                            await expectToThrowAccessDeniedErrorToObj(async () => {
                                await updateTestBillingAccount(integrationUser, anotherAccount.id, payload)
                            })
                        })
                    })
                    test('Integration manager cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await updateTestBillingAccount(integrationManager, account.id, payload)
                        })
                    })
                    test('Other users cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await updateTestBillingAccount(user, property.id, payload)
                        })
                    })
                })
                test('Anonymous cannot', async () => {
                    await expectToThrowAuthenticationErrorToObj(async () => {
                        await updateTestBillingAccount(anonymous, property.id, payload)
                    })
                })
            })
            describe('Multiple objects', () => {
                let anotherAccount
                let payload
                let anotherPayload
                beforeAll(async () => {
                    [anotherAccount] = await createTestBillingAccount(admin, anotherContext, anotherProperty)
                })
                beforeEach(() => {
                    payload = {
                        id: account.id,
                        data:  {
                            unitName:  faker.lorem.word(),
                            fullName: faker.name.firstName(),
                        },
                    }
                    anotherPayload = {
                        id: anotherAccount.id,
                        data:  {
                            unitName:  faker.lorem.word(),
                            fullName: faker.name.firstName(),
                        },
                    }
                })
                test('Admin can for any context', async () => {
                    const [updatedAccounts] = await updateTestBillingAccounts(admin, [payload, anotherPayload])
                    expect(updatedAccounts).toBeDefined()
                    expect(updatedAccounts).toHaveLength(2)
                    expect(updatedAccounts).toEqual(expect.arrayContaining([
                        expect.objectContaining({ id: payload.id, ...payload.data }),
                        expect.objectContaining({ id: anotherPayload.id, ...anotherPayload.data }),
                    ]))
                })
                test('Support cannot', async () => {
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await updateTestBillingAccounts(support, [payload])
                    })
                })
                describe('User', () => {
                    describe('Integration account can if linked to permitted integration via context', () => {
                        test('All permitted must pass', async () => {
                            const [secondAccount] = await createTestBillingAccount(admin, context, property)
                            const secondPayload = { ...anotherPayload, id: secondAccount.id }
                            const [updatedAccounts] = await updateTestBillingAccounts(integrationUser, [payload, secondPayload])
                            expect(updatedAccounts).toBeDefined()
                            expect(updatedAccounts).toHaveLength(2)
                            expect(updatedAccounts).toEqual(expect.arrayContaining([
                                expect.objectContaining({ id: payload.id, ...payload.data }),
                                expect.objectContaining({ id: secondAccount.id, ...secondPayload.data }),
                            ]))
                        })
                        test('Partly permitted must fail', async () => {
                            await expectToThrowAccessDeniedErrorToObjects(async () => {
                                await updateTestBillingAccounts(integrationUser, [payload, anotherPayload])
                            })
                        })
                    })
                    test('Integration manager cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObjects(async () => {
                            await updateTestBillingAccounts(integrationManager, [payload])
                        })
                    })
                    test('Other users cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObjects(async () => {
                            await updateTestBillingAccounts(user, [payload])
                        })
                    })
                })
                test('Anonymous cannot', async () => {
                    await expectToThrowAuthenticationErrorToObjects(async () => {
                        await updateTestBillingAccounts(anonymous, [payload])
                    })
                })
            })
        })
        describe('Read', () => {
            let account
            let anotherAccount
            beforeAll(async () => {
                [account] = await createTestBillingAccount(admin, context, property)
                const [secondAccount] = await createTestBillingAccount(admin, anotherContext, anotherProperty)
                anotherAccount = secondAccount
            })
            test('Admin can read all', async () => {
                const accounts = await BillingAccount.getAll(admin, {
                    id_in: [account.id, anotherAccount.id],
                })
                expect(accounts).toHaveLength(2)
                expect(accounts).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: account.id }),
                    expect.objectContaining({ id: anotherAccount.id }),
                ]))
            })
            test('Support can read all', async () => {
                const accounts = await BillingAccount.getAll(support, {
                    id_in: [account.id, anotherAccount.id],
                })
                expect(accounts).toHaveLength(2)
                expect(accounts).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: account.id }),
                    expect.objectContaining({ id: anotherAccount.id }),
                ]))
            })
            describe('User', () => {
                test('Integration account can, but only for permitted integration', async () => {
                    const accounts = await BillingAccount.getAll(integrationUser, {
                        id_in: [account.id, anotherAccount.id],
                    })
                    expect(accounts).toHaveLength(1)
                    expect(accounts[0]).toHaveProperty('id', account.id)
                })
                test('Integration manager can, but only for his organization', async () => {
                    const accounts = await BillingAccount.getAll(integrationManager, {
                        id_in: [account.id, anotherAccount.id],
                    })
                    expect(accounts).toHaveLength(1)
                    expect(accounts[0]).toHaveProperty('id', account.id)
                })
                test('Employee with `canReadBillingReceipts` can, but only for permitted organization', async () => {
                    const reader = await createReceiptsReader(context.organization)
                    const accounts = await BillingAccount.getAll(reader, {
                        id_in: [account.id, anotherAccount.id],
                    })
                    expect(accounts).toHaveLength(1)
                    expect(accounts[0]).toHaveProperty('id', account.id)
                })
                test('Other users cannot', async () => {
                    const accounts = await BillingAccount.getAll(user, {
                        id_in: [account.id, anotherAccount.id],
                    })
                    expect(accounts).not.toBeFalsy()
                    expect(accounts).toHaveLength(0)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await BillingAccount.getAll(anonymous, {
                        id_in: [account.id, anotherAccount.id],
                    })
                })
            })
        })
        describe('Delete', () => {
            let account
            let payload
            beforeEach(async () => {
                [account] = await createTestBillingAccount(admin, context, property)
                payload = { deletedAt: dayjs().toISOString() }
            })
            describe('Hard delete is restricted for everyone', () => {
                test('Single object mutation', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(admin, account.id)
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(support, account.id)
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(integrationUser, account.id)
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(integrationManager, account.id)
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(user, account.id)
                    })
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await BillingAccount.delete(anonymous, account.id)
                    })
                })
                test('Multiple objects mutation', async () => {
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(admin, [account.id])
                    })
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(support, [account.id])
                    })
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(integrationUser, [account.id])
                    })
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(integrationManager, [account.id])
                    })
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(user, [account.id])
                    })
                    await expectToThrowAccessDeniedErrorToObjects(async () => {
                        await BillingAccount.deleteMany(anonymous, [account.id])
                    })
                })
            })
            describe('Soft delete', () => {
                test('Admin can', async () => {
                    const [updatedAccount] = await updateTestBillingAccount(admin, account.id, payload)
                    expect(updatedAccount).toBeDefined()
                    expect(updatedAccount).toHaveProperty('deletedAt')
                    expect(updatedAccount.deletedAt).not.toBeNull()
                })
                test('Support cannot', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestBillingAccount(support, account.id, payload)
                    })
                })
                describe('User', () => {
                    describe('Integration account', () => {
                        test('Can if linked to permitted integration via context', async () => {
                            const [updatedAccount] = await updateTestBillingAccount(integrationUser, account.id, payload)
                            expect(updatedAccount).toBeDefined()
                            expect(updatedAccount).toHaveProperty('deletedAt')
                            expect(updatedAccount.deletedAt).not.toBeNull()
                        })
                        test('Cannot otherwise', async () => {
                            const [anotherAccount] = await createTestBillingAccount(admin, anotherContext, anotherProperty)
                            await expectToThrowAccessDeniedErrorToObj(async () => {
                                await updateTestBillingAccount(integrationUser, anotherAccount.id, payload)
                            })
                        })
                    })
                    test('Integration manager cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await updateTestBillingAccount(integrationManager, account.id, payload)
                        })
                    })
                    test('Other users cannot', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await updateTestBillingAccount(user, account.id, payload)
                        })
                    })
                })
                test('Anonymous cannot', async () => {
                    await expectToThrowAuthenticationErrorToObj(async () => {
                        await updateTestBillingAccount(anonymous, account.id, payload)
                    })
                })
            })
        })
    })
    describe('Constraints', () => {
        describe('globalId', () => {
            let globalId
            beforeEach(async () => {
                globalId = faker.datatype.uuid()
            })
            test('Can be same if context is different', async () => {
                const [account] = await createTestBillingAccount(admin, context, property, {
                    globalId,
                })
                expect(account).toBeDefined()
                expect(account).toHaveProperty('globalId', globalId)
                const [anotherAccount] = await createTestBillingAccount(admin, anotherContext, anotherProperty, {
                    globalId,
                })
                expect(anotherAccount).toBeDefined()
                expect(anotherAccount).toHaveProperty('globalId', globalId)
            })
            test('Must be unique within the same context', async () => {
                const [account] = await createTestBillingAccount(admin, context, property, {
                    globalId,
                })
                expect(account).toBeDefined()
                expect(account).toHaveProperty('globalId', globalId)
                await expectToThrowInternalError(async () => {
                    await createTestBillingAccount(admin, context, property, {
                        globalId,
                    })
                }, 'billingAccount_unique_context_globalId')
            })
        })
    })
})