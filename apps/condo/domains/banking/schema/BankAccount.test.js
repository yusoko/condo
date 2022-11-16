/**
 * Generated by `createschema banking.BankAccount 'organization:Relationship:Organization:CASCADE; tin:Text; country:Text; routingNumber:Text; number:Text; currency:Text; approvedAt?:DateTimeUtc; approvedBy?:Text; importId?:Text; territoryCode?:Text; bankName?:Text; meta?:Json; tinMeta?:Json; routingNumberMeta?:Json'`
 */

const { makeLoggedInAdminClient, makeClient } = require('@open-condo/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, catchErrorFrom,
} = require('@open-condo/keystone/test.utils')

const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

const { BankAccount, createTestBankAccount, updateTestBankAccount } = require('@condo/domains/banking/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationEmployeeRole, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i

describe('BankAccount', () => {
    describe('CRUD tests', () => {
        describe('create', () => {
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [bankAccount] = await createTestBankAccount(admin, organization)

                expect(bankAccount.organization.id).toEqual(organization.id)
                expect(bankAccount.tin).toBeDefined()
                expect(bankAccount.country).toEqual('ru')
                expect(bankAccount.routingNumber).toBeDefined()
                expect(bankAccount.number).toBeDefined()
                expect(bankAccount.currencyCode).toEqual('RUB')
            })

            test('support can', async () => {
                const support = await makeClientWithSupportUser()
                const [organization] = await createTestOrganization(support)

                const [bankAccount] = await createTestBankAccount(support, organization)

                expect(bankAccount.organization.id).toEqual(organization.id)
                expect(bankAccount.tin).toBeDefined()
                expect(bankAccount.country).toEqual('ru')
                expect(bankAccount.routingNumber).toBeDefined()
                expect(bankAccount.number).toBeDefined()
                expect(bankAccount.currencyCode).toEqual('RUB')
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [ organization ] = await createTestOrganization(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestBankAccount(user, organization)
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [ organization ] = await createTestOrganization(admin)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestBankAccount(anonymous, organization)
                })
            })
        })

        describe('read', () => {
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization)
                const [readObj] = await BankAccount.getAll(admin, { id: createdObj.id })

                expect(createdObj.organization.id).toEqual(readObj.organization.id)
                expect(createdObj.tin).toEqual(readObj.tin)
                expect(createdObj.country).toEqual(readObj.country)
                expect(createdObj.routingNumber).toEqual(readObj.routingNumber)
                expect(createdObj.number).toEqual(readObj.number)
                expect(createdObj.currencyCode).toEqual(readObj.currencyCode)
            })

            test('support can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const support = await makeClientWithSupportUser()

                const [createdObj] = await createTestBankAccount(admin, organization)
                const [readObj] = await BankAccount.getAll(support, { id: createdObj.id })

                expect(createdObj.organization.id).toEqual(readObj.organization.id)
                expect(createdObj.tin).toEqual(readObj.tin)
                expect(createdObj.country).toEqual(readObj.country)
                expect(createdObj.routingNumber).toEqual(readObj.routingNumber)
                expect(createdObj.number).toEqual(readObj.number)
                expect(createdObj.currencyCode).toEqual(readObj.currencyCode)
            })

            test('user can only for organization it employed in', async () => {
                const admin = await makeLoggedInAdminClient()
                const employeeUserClient = await makeClientWithNewRegisteredAndLoggedInUser()

                const [ organization ] = await createTestOrganization(admin)
                const [ role ] = await createTestOrganizationEmployeeRole(admin, organization)
                await createTestOrganizationEmployee(admin, organization, employeeUserClient.user, role)

                const [ createdObj ] = await createTestBankAccount(admin, organization)

                const [ readObj ] = await BankAccount.getAll(employeeUserClient, {})

                expect(createdObj.organization.id).toEqual(readObj.organization.id)
                expect(createdObj.tin).toEqual(readObj.tin)
                expect(createdObj.country).toEqual(readObj.country)
                expect(createdObj.routingNumber).toEqual(readObj.routingNumber)
                expect(createdObj.number).toEqual(readObj.number)
                expect(createdObj.currencyCode).toEqual(readObj.currencyCode)
            })

            test('user can\'t  when it\'s an employee of another organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const employeeUserClient = await makeClientWithNewRegisteredAndLoggedInUser()

                const [ organization ] = await createTestOrganization(admin)

                const [ anotherOrganization ] = await createTestOrganization(admin)
                const [ role ] = await createTestOrganizationEmployeeRole(admin, anotherOrganization)
                await createTestOrganizationEmployee(admin, anotherOrganization, employeeUserClient.user, role)

                await createTestBankAccount(admin, organization)

                const readObj = await BankAccount.getAll(employeeUserClient, {})

                expect(readObj).toHaveLength(0)
            })

            test('user can\'t when it\'s not an employee of organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [ organization ] = await createTestOrganization(admin)

                await createTestBankAccount(admin, organization)

                const readObjects = await BankAccount.getAll(user, {})

                expect(readObjects).toHaveLength(0)
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [ organization ] = await createTestOrganization(admin)

                await createTestBankAccount(admin, organization)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await BankAccount.getAll(anonymous, {})
                })
            })
        })

        describe('update', () => {
            test('admin can', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [ createdObj ] = await createTestBankAccount(admin, organization)
                const [ updatedObj ] = await updateTestBankAccount(admin, createdObj.id, { bankName: 'NewBankName' })

                expect(createdObj.id).toEqual(updatedObj.id)
                expect(updatedObj.bankName).toEqual('NewBankName')
            })

            test('support can', async () => {
                const support = await makeClientWithSupportUser()
                const [organization] = await createTestOrganization(support)

                const [ createdObj ] = await createTestBankAccount(support, organization)
                const [ updatedObj ] = await updateTestBankAccount(support, createdObj.id, { bankName: 'NewBankName' })

                expect(createdObj.id).toEqual(updatedObj.id)
                expect(updatedObj.bankName).toEqual('NewBankName')
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()
                const [organization] = await createTestOrganization(admin)

                const [ createdObj ] = await createTestBankAccount(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {await updateTestBankAccount(user,
                    createdObj.id, { bankName: 'NewBankName' })
                })
            })

            test('anonymous can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()
                const [organization] = await createTestOrganization(admin)

                const [ createdObj ] = await createTestBankAccount(admin, organization)

                await expectToThrowAuthenticationErrorToObj(async () => {await updateTestBankAccount(anonymous,
                    createdObj.id, { bankName: 'NewBankName' })
                })
            })
        })

        describe('hard delete', () => {
            test('admin can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankAccount.delete(admin, createdObj.id)
                })
            })

            test('support can\'t', async () => {
                const support = await makeClientWithSupportUser()
                const [organization] = await createTestOrganization(support)

                const [createdObj] = await createTestBankAccount(support, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankAccount.delete(support, createdObj.id)
                })
            })

            test('user can\'t', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()
                const [organization] = await createTestOrganization(admin)

                const [ createdObj ] = await createTestBankAccount(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await BankAccount.delete(user, createdObj.id)
                })
            })
        })
    })

    describe('fields', () => {
        describe('approvedAt', () => {
            test('can create approved bankAccount', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization, { approvedAt: 'true'  })

                expect(createdObj.approvedAt).toMatch(ISO_8601_FULL)
                expect(createdObj.approvedBy.id).toEqual(admin.user.id)
            })

            test('setting approvedAt automatically sets approvedBy', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization)
                const [updatedObj] = await updateTestBankAccount(admin, createdObj.id, { approvedAt: 'true'  })

                expect(createdObj.id).toEqual(updatedObj.id)
                expect(createdObj.approvedAt).toBeNull()
                expect(createdObj.approvedBy).toBeNull()

                expect(updatedObj.approvedAt).toMatch(ISO_8601_FULL)
                expect(updatedObj.approvedBy.id).toEqual(admin.user.id)
            })

            test('when model is updated, approvedAt and approvedBy are set to NULL', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization, { approvedAt: 'true' })
                const [updatedObj] = await updateTestBankAccount(admin, createdObj.id, { bankName: 'NewBankName' })

                expect(createdObj.id).toEqual(updatedObj.id)
                expect(createdObj.approvedBy.id).toEqual(admin.user.id)

                expect(updatedObj.approvedBy).toBeNull()
                expect(updatedObj.approvedAt).toBeNull()
                expect(updatedObj.bankName).toEqual('NewBankName')
            })

            test('support can update approved fields', async () => {
                const support = await makeClientWithSupportUser()
                const [organization] = await createTestOrganization(support)

                const [createdObj] = await createTestBankAccount(support, organization)
                const [updatedObj] = await updateTestBankAccount(support, createdObj.id, { approvedAt: 'true' })

                expect(createdObj.id).toEqual(updatedObj.id)
                expect(createdObj.approvedAt).toBeNull()
                expect(createdObj.approvedBy).toBeNull()
                expect(updatedObj.approvedBy.id).toEqual(support.user.id)
            })

            test('user can\'t update isApproved field', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestBankAccount(user, createdObj.id, { approvedAt: 'true' })
                })
            })
        })

        describe('approvedBy', () => {
            test('approvedBy field is not creatable', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                await catchErrorFrom(
                    async () => {
                        await createTestBankAccount(admin, organization, { approvedBy: { connect: { id: admin.user.id } } })
                    }, (e) => {
                        const msg = e.errors[0].message
                        expect(msg).toContain('Field "approvedBy" is not defined by type "BankAccountCreateInput"')
                    }
                )
            })

            test('approvedBy field is not updatable', async () => {
                const admin = await makeLoggedInAdminClient()
                const [organization] = await createTestOrganization(admin)

                const [createdObj] = await createTestBankAccount(admin, organization)

                await catchErrorFrom(
                    async () => {
                        await updateTestBankAccount(admin, createdObj.id, { approvedBy: { connect: { id: admin.user.id } } })
                    }, (e) => {
                        const msg = e.errors[0].message
                        expect(msg).toContain('Field "approvedBy" is not defined by type "BankAccountUpdateInput"')
                    }
                )
            })
        })
    })

    describe('constraints', () => {
        test('can\'t create same BankAccount', async () => {
            const admin = await makeLoggedInAdminClient()
            const [organization] = await createTestOrganization(admin)

            const [bankAccount] = await createTestBankAccount(admin, organization)

            await catchErrorFrom(
                async () => {
                    await createTestBankAccount(admin, organization, {
                        tin: bankAccount.tin,
                        routingNumber: bankAccount.routingNumber,
                        number: bankAccount.number,
                    })
                }, (e) => {
                    const msg = e.errors[0].message
                    expect(msg).toContain('duplicate key value violates unique constraint')
                }
            )
        })

        test('can delete and then create another BankAccount with same requisites', async () => {
            const admin = await makeLoggedInAdminClient()
            const [organization] = await createTestOrganization(admin)

            const [firstBankAccount] = await createTestBankAccount(admin, organization)

            await updateTestBankAccount(admin, firstBankAccount.id, { deletedAt: 'true' })

            const [secondBankAccount] = await createTestBankAccount(admin, organization, {
                tin: firstBankAccount.tin,
                routingNumber: firstBankAccount.routingNumber,
                number: firstBankAccount.number,
            })

            expect(firstBankAccount.id).toBeDefined()
            expect(secondBankAccount.id).toBeDefined()
            expect(firstBankAccount.id).not.toEqual(secondBankAccount.id)
        })
    })
})
