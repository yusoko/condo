/**
 * Generated by `createschema miniapp.B2CApp 'name:Text;'`
 */

const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')

const { B2CApp, createTestB2CApp, updateTestB2CApp } = require('@condo/domains/miniapp/utils/testSchema')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
} = require('@condo/domains/common/utils/testSchema')
const { makeClientWithSupportUser, makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const faker = require('faker')
const dayjs = require('dayjs')

describe('B2CApp', () => {
    describe('CRUD operations', () => {
        let admin
        let user
        let support
        let anonymous
        beforeAll(async () => {
            admin = await makeLoggedInAdminClient()
            support = await makeClientWithSupportUser()
            user = await makeClientWithNewRegisteredAndLoggedInUser()
            anonymous = await makeClient()
        })
        describe('Create', () => {
            test('Admin can', async () => {
                const [app] = await createTestB2CApp(admin)
                expect(app).toBeDefined()
                expect(app).toHaveProperty('id')
            })
            test('Support can', async () => {
                const payload = {
                    name: faker.company.companyName(),
                }
                const [app] = await createTestB2CApp(support, payload)
                expect(app).toBeDefined()
                expect(app).toHaveProperty('id')
                expect(app).toEqual(expect.objectContaining(payload))
            })
            test('User cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestB2CApp(user)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestB2CApp(anonymous)
                })
            })
        })
        describe('Read', () => {
            let app
            const payload = {
                name: faker.company.companyName(),
                isHidden: false,
            }
            beforeAll(async () => {
                [app] = await createTestB2CApp(admin, payload)
            })
            test('Admin can', async () => {
                const apps = await B2CApp.getAll(admin, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toEqual(expect.objectContaining(payload))
            })
            test('Support can', async () => {
                const apps = await B2CApp.getAll(support, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toEqual(expect.objectContaining(payload))
            })
            test('User can', async () => {
                const apps = await B2CApp.getAll(user, {
                    id: app.id,
                })
                expect(apps).toBeDefined()
                expect(apps).toHaveLength(1)
                expect(apps[0]).toEqual(expect.objectContaining(payload))
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await B2CApp.getAll(anonymous, {
                        id: app.id,
                    })
                })
            })
        })
        describe('Update', () => {
            let app
            let payload
            beforeAll(async () => {
                [app] = await createTestB2CApp(admin)
            })
            beforeEach(() => {
                payload = { name: faker.company.companyName() }
            })
            describe('Admin', () => {
                test('Can update', async () => {
                    expect(app).toBeDefined()
                    expect(app).toEqual(expect.not.objectContaining(payload))
                    const [updatedApp] = await updateTestB2CApp(admin, app.id, payload)
                    expect(updatedApp).toBeDefined()
                    expect(updatedApp).toEqual(expect.objectContaining(payload))
                })
                test('Can soft-delete', async () => {
                    const [b2cApp] = await createTestB2CApp(admin)
                    expect(b2cApp).toHaveProperty('deletedAt', null)
                    const [deletedApp] = await updateTestB2CApp(admin, b2cApp.id, {
                        deletedAt: dayjs().toISOString(),
                    })
                    expect(deletedApp).toBeDefined()
                    expect(deletedApp).toHaveProperty('deletedAt')
                    expect(deletedApp.deletedAt).not.toBeNull()
                })
            })
            describe('Support', () => {
                test('Can update', async () => {
                    expect(app).toBeDefined()
                    expect(app).toEqual(expect.not.objectContaining(payload))
                    const [updatedApp] = await updateTestB2CApp(support, app.id, payload)
                    expect(updatedApp).toBeDefined()
                    expect(updatedApp).toEqual(expect.objectContaining(payload))
                })
                test('Can soft-delete', async () => {
                    const [b2cApp] = await createTestB2CApp(support)
                    expect(b2cApp).toHaveProperty('deletedAt', null)
                    const [deletedApp] = await updateTestB2CApp(support, b2cApp.id, {
                        deletedAt: dayjs().toISOString(),
                    })
                    expect(deletedApp).toBeDefined()
                    expect(deletedApp).toHaveProperty('deletedAt')
                    expect(deletedApp.deletedAt).not.toBeNull()
                })
            })
            test('User cannot', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestB2CApp(user, app.id, payload)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestB2CApp(anonymous, app.id, payload)
                })
            })
        })
        describe('Delete', () => {
            let app
            beforeAll(async () => {
                [app] = await createTestB2CApp(admin)
            })
            test('Nobody can', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CApp.delete(admin, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CApp.delete(support, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CApp.delete(user, app.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CApp.delete(anonymous, app.id)
                })
            })
        })
    })
})
