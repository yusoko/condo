/**
 * Generated by `createservice resident.FindOrganizationsForAddressService --type queries`
 */
/**
 * Generated by `createservice resident.RegisterServiceConsumerService --type mutations`
 */

const { faker } = require('@faker-js/faker')
const Big = require('big.js')
const express = require('express')

const { initTestExpressApp, getTestExpressApp } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAccessDeniedErrorToResult,
    expectToThrowAuthenticationErrorToResult,
} = require('@open-condo/keystone/test.utils')

const { CONTEXT_FINISHED_STATUS, CONTEXT_IN_PROGRESS_STATUS } = require('@condo/domains/acquiring/constants/context')
const { HOUSING_CATEGORY_ID, REPAIR_CATEGORY_ID } = require('@condo/domains/billing/constants/constants')
const {
    ONLINE_INTERACTION_CHECK_ACCOUNT_NOT_FOUND_STATUS,
    ONLINE_INTERACTION_CHECK_ACCOUNT_SUCCESS_STATUS,
} = require('@condo/domains/billing/constants/onlineInteraction')
const {
    TestUtils,
    ResidentTestMixin,
    MeterTestMixin,
} = require('@condo/domains/billing/utils/testSchema/testUtils')
const { findOrganizationsForAddressByTestClient } = require('@condo/domains/resident/utils/testSchema')

describe('FindOrganizationsForAddress', () => {

    let utils

    beforeAll(async () => {
        utils = new TestUtils([ResidentTestMixin, MeterTestMixin])
        await utils.init()
    })

    describe('Online interaction', () => {

        // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
        const app = express()
        const apiHandler = jest.fn()
        const CHECK_URL_PATH = '/check-account-number'

        app.get(CHECK_URL_PATH, async (req, res) => {
            return res.json(await apiHandler())
        })

        initTestExpressApp('OnlineInteraction', app)

        beforeAll(async () => {
            const baseUrl = getTestExpressApp('OnlineInteraction').baseUrl + CHECK_URL_PATH
            await utils.updateBillingIntegration({ checkAccountNumberUrl: baseUrl })
        })

        afterAll(async () => {
            await utils.updateBillingIntegration({ checkAccountNumberUrl: null })
        })

        afterEach(() => {
            jest.clearAllMocks()
        })

        test('do not returns organization if account not found', async () => {
            const notExistingAccountNumber = faker.random.alphaNumeric(16)
            apiHandler.mockResolvedValue({ status: ONLINE_INTERACTION_CHECK_ACCOUNT_NOT_FOUND_STATUS })
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: notExistingAccountNumber,
                tin: utils.organization.tin,
            })
            expect(apiHandler).toHaveBeenCalledTimes(1)
            expect(foundOrganizations).toHaveLength(0)
        })

        test('returns organization and receipt if account found', async () => {
            const existingAccountNumber = faker.random.alphaNumeric(16)
            apiHandler.mockResolvedValue({ status: ONLINE_INTERACTION_CHECK_ACCOUNT_SUCCESS_STATUS, services: [{
                category: HOUSING_CATEGORY_ID,
                account: { number: existingAccountNumber },
                bankAccount: {
                    number: faker.random.alphaNumeric(16),
                    routingNumber: faker.random.alphaNumeric(16),
                },
            }] })
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: existingAccountNumber,
                tin: utils.organization.tin,
            })
            const foundResult = foundOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(foundResult.account).not.toBeNull()
            expect(foundResult.account.balance).toBeNull()
            expect(apiHandler).toHaveBeenCalledTimes(1)
        })

    })

    describe('Billing receipts cases', () => {

        test('finds organization if only addressKey is specified', async () => {
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            const found = foundOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(found.account).toBeNull()
            expect(found.hasMeters).toBeFalsy()
            expect(found.hasBillingData).toBeTruthy()
            expect(found.organization).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                tin: expect.any(String),
                type: expect.any(String),
            })
        })

        test('find account and receipt if unitName and unitType matches', async () => {
            const unitName = utils.randomNumber(10).toString()
            const unitType = 'flat'
            const accountNumber = utils.randomNumber(10).toString()
            const toPay = utils.randomNumber(5).toString()
            await utils.createReceipts([
                utils.createJSONReceipt({
                    address: utils.property.address,
                    accountNumber,
                    addressMeta: { unitName, unitType },
                    toPay,
                }),
            ])
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                unitName,
                unitType,
            })
            const found = foundOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(found.account).toMatchObject({
                number: expect.stringMatching(accountNumber),
                category: expect.any(String),
                balance: expect.stringMatching(Big(toPay).toFixed(2)),
                routingNumber: expect.any(String),
                bankAccountNumber: expect.any(String),
            })
        })

        test('returns multiple records if several receipts matches for one organization', async () => {
            const unitName = utils.randomNumber(10).toString()
            const unitType = 'flat'
            const accountNumber = utils.randomNumber(10).toString()
            const sameInput = { address: utils.property.address, accountNumber, addressMeta: { unitName, unitType } }
            await utils.createReceipts([
                utils.createJSONReceipt({
                    category: { id: HOUSING_CATEGORY_ID },
                    ...sameInput,
                }),
                utils.createJSONReceipt({
                    category: { id: REPAIR_CATEGORY_ID },
                    ...sameInput,
                }),
            ])
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                unitName,
                unitType,
            })
            const found = foundOrganizations.filter(({ account: { number } }) => number === accountNumber)
            expect(found).toHaveLength(2)
        })

        test('returns organization with not matching unitName + unitType', async () => {
            const unitName = utils.randomNumber(10).toString()
            const unitType = 'flat'
            await utils.createReceipts([
                utils.createJSONReceipt({ address: utils.property.address, addressMeta: { unitName, unitType } }),
            ])
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                unitName,
                unitType: 'warehouse',
            })
            const found = foundOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(found.account).toBeNull()
            expect(found.organization).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                tin: expect.any(String),
                type: expect.any(String),
            })
        })

        test('do not returns organization with not matching account number', async () => {
            const accountNumber = utils.randomNumber(10).toString()
            const wrongAccountNumber = utils.randomNumber(10).toString()
            const unitName = utils.randomNumber(10).toString()
            const unitType = 'flat'
            await utils.createReceipts([
                utils.createJSONReceipt({ address: utils.property.address, accountNumber, addressMeta: { unitName, unitType } }),
            ])
            const [correctAccountNumberOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: accountNumber,
            })
            const correctAccountNumberFound = correctAccountNumberOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(correctAccountNumberFound.organization).toBeDefined()
            const [wrongAccountNumberOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: wrongAccountNumber,
            })
            const wrongAccountNumberFound = wrongAccountNumberOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(wrongAccountNumberFound).toBeUndefined()
        })
    })

    describe('Meters cases', () => {
        test('returns organization with not matching unitName + unitType', async () => {
            const wrongUnitName = utils.randomNumber(10).toString()
            await utils.createMeter()
            const [foundOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                unitName: wrongUnitName,
                unitType: 'flat',
            })
            const found = foundOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(found.hasMeters).toBeTruthy()
            expect(found.organization).toBeDefined()
        })
        test('returns organization with matching account number', async () => {
            const accountNumber = utils.randomNumber(10).toString()
            await utils.createMeter({ accountNumber })
            const [correctAccountNumberOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: accountNumber,
            })
            const correctAccountNumberFound = correctAccountNumberOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(correctAccountNumberFound.organization).toBeDefined()
            expect(correctAccountNumberFound.hasMeters).toBeTruthy()
        })
        test('do not returns organization with not matching account number', async () => {
            const accountNumber = utils.randomNumber(10).toString()
            const wrongAccountNumber = utils.randomNumber(10).toString()
            await utils.createMeter({ accountNumber })
            const [correctAccountNumberOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: accountNumber,
            })
            const correctAccountNumberFound = correctAccountNumberOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(correctAccountNumberFound.organization).toBeDefined()
            expect(correctAccountNumberFound.hasMeters).toBeTruthy()
            const [wrongAccountNumberOrganizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
                accountNumber: wrongAccountNumber,
            })
            const wrongAccountNumberFound = wrongAccountNumberOrganizations.find(({ organization: { id } }) => id === utils.organization.id)
            expect(wrongAccountNumberFound).toBeUndefined()
        })
    })

    describe('contexts statuses', () => {

        afterEach(async () => {
            await utils.updateBillingContext({ status: CONTEXT_FINISHED_STATUS })
            await utils.updateAcquiringContext({ status: CONTEXT_FINISHED_STATUS })
        })

        test('should not return organization if billing context is not in finished status', async () => {
            const [foundOrganizationsOnFinishedContext] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            const foundForFinishedContext = foundOrganizationsOnFinishedContext.find(({ organization: { id } }) => id === utils.organization.id)
            expect(foundForFinishedContext).not.toBeUndefined()
            await utils.updateBillingContext({ status: CONTEXT_IN_PROGRESS_STATUS })
            const [foundOrganizationsOnInProgressContext] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            const foundForInProgressContext = foundOrganizationsOnInProgressContext.find(({ organization: { id } }) => id === utils.organization.id)
            expect(foundForInProgressContext).toBeUndefined()
        })

        test('should not return organization if acquiring context is not in finished status', async () => {
            const [foundOrganizationsOnFinishedContext] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            const foundForFinishedContext = foundOrganizationsOnFinishedContext.find(({ organization: { id } }) => id === utils.organization.id)
            expect(foundForFinishedContext).not.toBeUndefined()
            await utils.updateAcquiringContext({ status: CONTEXT_IN_PROGRESS_STATUS })
            const [foundOrganizationsOnInProgressContext] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            const foundForInProgressContext = foundOrganizationsOnInProgressContext.find(({ organization: { id } }) => id === utils.organization.id)
            expect(foundForInProgressContext).toBeUndefined()
        })

    })

    describe('Permission check', () => {
        test('anonymous: can not execute', async () => {
            await expectToThrowAuthenticationErrorToResult(async () => {
                await findOrganizationsForAddressByTestClient(utils.clients.anonymous, {
                    addressKey: utils.property.addressKey,
                })
            })
        })
        test('user: can not execute', async () => {
            await expectToThrowAccessDeniedErrorToResult(async () => {
                await findOrganizationsForAddressByTestClient(utils.clients.user, {
                    addressKey: utils.property.addressKey,
                })
            })
        })
        test('employee: can not execute', async () => {
            await expectToThrowAccessDeniedErrorToResult(async () => {
                await findOrganizationsForAddressByTestClient(utils.clients.employee.billing, {
                    addressKey: utils.property.addressKey,
                })
            })
        })
        test('service user: can not execute', async () => {
            await expectToThrowAccessDeniedErrorToResult(async () => {
                await findOrganizationsForAddressByTestClient(utils.clients.service, {
                    addressKey: utils.property.addressKey,
                })
            })
        })
        test('admin: can execute', async () => {
            const [organizations] = await findOrganizationsForAddressByTestClient(utils.clients.admin, {
                addressKey: utils.property.addressKey,
            })
            expect(organizations).not.toHaveLength(0)
        })
        test('support: can not execute', async () => {
            const [organizations] = await findOrganizationsForAddressByTestClient(utils.clients.support, {
                addressKey: utils.property.addressKey,
            })
            expect(organizations).not.toHaveLength(0)
        })
        test('resident: can execute', async () => {
            const [organizations] = await findOrganizationsForAddressByTestClient(utils.clients.resident, {
                addressKey: utils.property.addressKey,
            })
            expect(organizations).not.toHaveLength(0)
        })
    })

})