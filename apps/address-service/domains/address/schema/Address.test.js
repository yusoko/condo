/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 */

const faker = require('faker')

const {
    makeLoggedInAdminClient,
    makeClient,
    UUID_RE,
    DATETIME_RE,
    catchErrorFrom,
} = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const { Address, createTestAddress, updateTestAddress } = require('@address-service/domains/address/utils/testSchema')
const {
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@address-service/domains/user/utils/testSchema')


let adminClient, supportClient, userClient, anonymousClient, sender

describe('Address', () => {
    beforeAll(async () => {
        adminClient = await makeLoggedInAdminClient()
        supportClient = await makeClientWithSupportUser()
        userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymousClient = await makeClient()
        sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }
    })

    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                // 2) action
                const [obj, attrs] = await createTestAddress(adminClient)

                // 3) check
                expect(obj.id).toMatch(UUID_RE)
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(1)
                expect(obj.newId).toEqual(null)
                expect(obj.deletedAt).toEqual(null)
                expect(obj.createdBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
                expect(obj.createdAt).toMatch(DATETIME_RE)
                expect(obj.updatedAt).toMatch(DATETIME_RE)
            })

            test('support can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddress(supportClient)
                })
            })

            test('user can\'t', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestAddress(userClient)
                })
            })

            test('anonymous can\'t', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestAddress(anonymousClient)
                })
            })
        })

        describe('update', () => {
            test('admin can', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                const [obj, attrs] = await updateTestAddress(adminClient, objCreated.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })

            test('support can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddress(supportClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestAddress(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestAddress(anonymousClient, objCreated.id)
                })
            })
        })

        describe('hard delete', () => {
            test('admin can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(adminClient, objCreated.id)
                })
            })

            test('user can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(userClient, objCreated.id)
                })
            })

            test('anonymous can\'t', async () => {
                const [objCreated] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await Address.delete(anonymousClient, objCreated.id)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                const objs = await Address.getAll(adminClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('support can', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                const objs = await Address.getAll(supportClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: obj.id,
                    }),
                ]))
            })

            test('user can\'t', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await Address.getAll(userClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })

            test('anonymous can\'t', async () => {
                const [obj, attrs] = await createTestAddress(adminClient)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await Address.getAll(anonymousClient, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })
        })
    })
})
