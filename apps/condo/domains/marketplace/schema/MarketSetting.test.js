/**
 * Generated by `createschema marketplace.MarketSetting 'organization:Relationship:Organization:CASCADE; residentAllowedPaymentTypes:Select:cash, online;'`
 */

const { faker } = require('@faker-js/faker')

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE, waitFor, expectValuesOfCommonFields, catchErrorFrom } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
} = require('@open-condo/keystone/test.utils')

const { INVOICE_PAYMENT_TYPES } = require('@condo/domains/marketplace/constants')
const { MarketSetting, createTestMarketSetting, updateTestMarketSetting } = require('@condo/domains/marketplace/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const {
    createTestOrganizationEmployeeRole,
    createTestOrganizationEmployee,
} = require('@condo/domains/organization/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestResident, createTestServiceConsumer } = require('@condo/domains/resident/utils/testSchema')
const { makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

describe('MarketSetting', () => {
    let admin, support, anonymous, user
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        user = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()
    })
    describe('access tests', () => {
        describe('admin', () => {
            test('can create', async () => {
                const [organization] = await createTestOrganization(admin)
                const [obj, attrs] = await createTestMarketSetting(admin, organization)

                expectValuesOfCommonFields(obj, attrs, admin)
            })

            test('can update', async () => {
                const [organization] = await createTestOrganization(admin)
                const [objCreated] = await createTestMarketSetting(admin, organization)

                const [obj, attrs] = await updateTestMarketSetting(admin, objCreated.id, { residentAllowedPaymentTypes: INVOICE_PAYMENT_TYPES[0] })

                expect(obj.residentAllowedPaymentTypes).toEqual([INVOICE_PAYMENT_TYPES[0]])
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
            })

            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MarketSetting.delete(admin, 'id')
                })
            })

            test('can read', async () => {
                const [organization] = await createTestOrganization(admin)
                const [objCreated] = await createTestMarketSetting(admin, organization)

                const objs = await MarketSetting.getAll(admin, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: objCreated.id,
                    }),
                ]))
            })
        })

        describe('support', () => {
            test('can create', async () => {
                const [organization] = await createTestOrganization(admin)
                const [obj, attrs] = await createTestMarketSetting(support, organization)

                expectValuesOfCommonFields(obj, attrs, support)
            })

            test('can update', async () => {
                const [organization] = await createTestOrganization(admin)
                const [objCreated] = await createTestMarketSetting(support, organization)

                const [obj, attrs] = await updateTestMarketSetting(support, objCreated.id, { residentAllowedPaymentTypes: INVOICE_PAYMENT_TYPES[0] })

                expect(obj.residentAllowedPaymentTypes).toEqual([INVOICE_PAYMENT_TYPES[0]])
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: support.user.id }))
            })

            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MarketSetting.delete(support, 'id')
                })
            })

            test('can read', async () => {
                const [organization] = await createTestOrganization(admin)
                const [objCreated] = await createTestMarketSetting(support, organization)

                const objs = await MarketSetting.getAll(support, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: objCreated.id,
                    }),
                ]))
            })
        })

        describe('employee with access', () => {
            test('can create', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: true,
                    canManageMarketSetting: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [obj, attrs] = await createTestMarketSetting(user, organization)

                expectValuesOfCommonFields(obj, attrs, user)
            })

            test('can update', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: true,
                    canManageMarketSetting: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [objCreated] = await createTestMarketSetting(user, organization)

                const [obj, attrs] = await updateTestMarketSetting(user, objCreated.id, { residentAllowedPaymentTypes: INVOICE_PAYMENT_TYPES[0] })

                expect(obj.residentAllowedPaymentTypes).toEqual([INVOICE_PAYMENT_TYPES[0]])
                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
                expect(obj.updatedBy).toEqual(expect.objectContaining({ id: user.user.id }))
            })

            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MarketSetting.delete(support, 'id')
                })
            })

            test('can read', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: true,
                    canManageMarketSetting: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [objCreated] = await createTestMarketSetting(user, organization)

                const objs = await MarketSetting.getAll(user, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: objCreated.id,
                    }),
                ]))
            })
        })

        describe('employee without access', () => {
            test('can\'t create', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: false,
                    canManageMarketSetting: false,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestMarketSetting(user, organization)
                })
            })

            test('can\'t update', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: false,
                    canManageMarketSetting: false,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [objCreated] = await createTestMarketSetting(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMarketSetting(user, objCreated.id, { residentAllowedPaymentTypes: INVOICE_PAYMENT_TYPES[0] })
                })
            })

            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MarketSetting.delete(support, 'id')
                })
            })

            test('can\'t read', async () => {
                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canReadMarketSetting: false,
                    canManageMarketSetting: false,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [objCreated] = await createTestMarketSetting(admin, organization)

                const objs = await MarketSetting.getAll(user, {
                    organization: { id: organization.id },
                }, { sortBy: ['updatedAt_DESC'] })

                expect(objs).toHaveLength(0)
            })
        })

        describe('resident', () => {
            let organization, residentClient, marketSetting
            beforeAll(async () => {
                [organization] = await createTestOrganization(admin)
                residentClient = await makeClientWithResidentUser()
                const unitName = faker.random.alphaNumeric(8)
                const accountNumber = faker.random.alphaNumeric(8)

                const [property] = await createTestProperty(admin, organization)
                const [resident] = await createTestResident(admin, residentClient.user, property, {
                    unitName,
                })
                await createTestServiceConsumer(admin, resident, organization, {
                    accountNumber,
                });
                [marketSetting] = await createTestMarketSetting(admin, organization)

            })
            test('can\'t create', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestMarketSetting(residentClient, organization)
                })
            })

            test('can\'t update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMarketSetting(residentClient, marketSetting.id, { residentAllowedPaymentTypes: INVOICE_PAYMENT_TYPES[0] })
                })
            })

            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await MarketSetting.delete(admin, 'id')
                })
            })

            test('Can only read settings of organizations in which he is a resident', async () => {
                const objs = await MarketSetting.getAll(residentClient, {}, { sortBy: ['updatedAt_DESC'] })

                expect(objs.length).toBeGreaterThanOrEqual(1)
                expect(objs).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: marketSetting.id,
                    }),
                ]))
            })
        })


    })


    describe('constraint tests', () => {
        test('single entry for one organization', async () => {
            const [organization] = await createTestOrganization(admin)
            const [obj, attrs] = await createTestMarketSetting(admin, organization)

            await catchErrorFrom(async () => {
                await createTestMarketSetting(admin, organization)
            }, (caught) => {
                expect(caught.errors[0].message).toContain('duplicate key value violates unique constraint "MarketSetting_unique_organization"')
            })
        })
    })
})
