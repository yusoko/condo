/**
 * Generated by `createschema banking.BankIntegration 'name:Text'`
 */

const { makeLoggedInAdminClient, makeClient } = require('@open-condo/keystone/test.utils')

const { expectToThrowAuthenticationErrorToObjects, expectToThrowAccessDeniedErrorToObj } = require('@open-condo/keystone/test.utils')

const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const { BankIntegration, createTestBankIntegration, updateTestBankIntegration } = require('@condo/domains/banking/utils/testSchema')
const { BANK_INTEGRATION_IDS } = require('../constants')
const { map } = require('lodash')

let admin
let user
let anonymous

describe('BankIntegration', () => {
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        user = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()
    })

    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestBankIntegration(admin)
                })
            })

            test('user cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestBankIntegration(user)
                })
            })

            test('anonymous cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestBankIntegration(anonymous)
                })
            })
        })

        describe('update', () => {
            test('admin cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestBankIntegration(admin, BANK_INTEGRATION_IDS.SBBOL)
                })
            })

            test('user cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestBankIntegration(user, BANK_INTEGRATION_IDS.SBBOL)
                })
            })

            test('anonymous cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestBankIntegration(anonymous, BANK_INTEGRATION_IDS.SBBOL)
                })
            })
        })

        describe('hard delete', () => {
            test('admin cannot', async () => {

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankIntegration.delete(admin, BANK_INTEGRATION_IDS.SBBOL)
                })
            })

            test('user cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankIntegration.delete(user, BANK_INTEGRATION_IDS.SBBOL)
                })
            })

            test('anonymous cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankIntegration.delete(anonymous, BANK_INTEGRATION_IDS.SBBOL)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const objs = await BankIntegration.getAll(admin, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS.SBBOL)).toBeTruthy()
                expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS['1CClientBankExchange'])).toBeTruthy()
            })

            test('user cannot', async () => {
                const objs = await BankIntegration.getAll(user, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS.SBBOL)).toBeTruthy()
                expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS['1CClientBankExchange'])).toBeTruthy()
            })

            test('anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await BankIntegration.getAll(anonymous, {}, { sortBy: ['updatedAt_DESC'] })
                })
            })
        })
    })

    test('table should have only two records', async () => {
        const objs = await BankIntegration.getAll(admin, {}, { sortBy: ['updatedAt_DESC'] })

        expect(objs.length).toEqual(2)
        expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS.SBBOL)).toBeTruthy()
        expect(map(objs, 'id').includes(BANK_INTEGRATION_IDS['1CClientBankExchange'])).toBeTruthy()
    })
})