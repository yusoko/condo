/**
 * Generated by `createschema miniapp.B2CAppBuild 'app:Relationship:B2CApp:PROTECT; version:Text'`
 */

const faker = require('faker')
const dayjs = require('dayjs')
const path = require('path')
const { makeLoggedInAdminClient, makeClient, UploadingFile } = require('@core/keystone/test.utils')
const conf = require('@core/config')

const {
    createTestB2CApp,
    updateTestB2CApp,
    createTestB2CAppAccessRight,
    B2CAppBuild,
    createTestB2CAppBuild,
    updateTestB2CAppBuild,
} = require('@condo/domains/miniapp/utils/testSchema')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
    expectToThrowValidationFailureError,
} = require('@condo/domains/common/utils/testSchema')
const {
    makeClientWithSupportUser,
    makeClientWithNewRegisteredAndLoggedInUser,
    updateTestUser,
} = require('@condo/domains/user/utils/testSchema')
const { NON_ZIP_FILE_ERROR, NO_APP_ERROR } = require('@condo/domains/miniapp/constants')
const { SERVICE } = require('@condo/domains/user/constants/common')

describe('B2CAppBuild', () => {
    let admin
    let support
    let app
    let permittedUser
    let user
    let anonymous
    let anotherPermittedUser
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        anonymous = await makeClient()
        user = await makeClientWithNewRegisteredAndLoggedInUser()

        permittedUser = await makeClientWithNewRegisteredAndLoggedInUser()

        await updateTestUser(admin, permittedUser.user.id, { type: SERVICE })
        const [b2cApp] = await createTestB2CApp(admin)
        app = b2cApp
        await createTestB2CAppAccessRight(admin, permittedUser.user, app)

        anotherPermittedUser = await makeClientWithNewRegisteredAndLoggedInUser()
        await updateTestUser(admin, anotherPermittedUser.user.id, { type: SERVICE })
        const [secondApp] = await createTestB2CApp(admin)
        await createTestB2CAppAccessRight(admin, anotherPermittedUser.user, secondApp)
    })
    describe('CRUD operations', () => {
        describe('Create', () => {
            test('Admin can', async () => {
                const [build] = await createTestB2CAppBuild(admin, app)
                expect(build).toBeDefined()
                expect(build).toHaveProperty(['app', 'id'], app.id)
            })
            test('Support can', async () => {
                const [build] = await createTestB2CAppBuild(support, app)
                expect(build).toBeDefined()
                expect(build).toHaveProperty(['app', 'id'], app.id)
            })
            describe('User', () => {
                describe('Service user with access rights', () => {
                    test('Can for linked B2C app', async () => {
                        const [build] = await createTestB2CAppBuild(permittedUser, app)
                        expect(build).toBeDefined()
                        expect(build).toHaveProperty(['app', 'id'], app.id)
                    })
                    test('Cannot for other B2C Apps', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await createTestB2CAppBuild(anotherPermittedUser, app)
                        })
                    })
                })
                test('Cannot otherwise', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestB2CAppBuild(user, app)
                    })
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestB2CAppBuild(anonymous, app)
                })
            })
        })
        describe('Update', () => {
            let build
            beforeEach(async () => {
                [build] = await createTestB2CAppBuild(admin, app)
            })
            test('Admin can update and soft-delete', async () => {
                const version = `${build.version}-beta`
                const [updatedBuild] = await updateTestB2CAppBuild(admin, build.id, { version })
                expect(updatedBuild).toHaveProperty('version', version)
                const [deletedBuild] = await updateTestB2CAppBuild(admin, build.id, { deletedAt: dayjs().toISOString() })
                expect(deletedBuild).toHaveProperty('deletedAt')
                expect(deletedBuild.deletedAt).not.toBeNull()
            })
            test('Support can update and soft-delete', async () => {
                const version = `${build.version}-beta`
                const [updatedBuild] = await updateTestB2CAppBuild(support, build.id, { version })
                expect(updatedBuild).toHaveProperty('version', version)
                const [deletedBuild] = await updateTestB2CAppBuild(support, build.id, { deletedAt: dayjs().toISOString() })
                expect(deletedBuild).toHaveProperty('deletedAt')
                expect(deletedBuild.deletedAt).not.toBeNull()
            })
            describe('User', () => {
                describe('User with access right', () => {
                    test('Can update and soft-delete builds for linked B2C app', async () => {
                        const version = `${build.version}-beta`
                        const [updatedBuild] = await updateTestB2CAppBuild(permittedUser, build.id, { version })
                        expect(updatedBuild).toHaveProperty('version', version)
                        const [deletedBuild] = await updateTestB2CAppBuild(permittedUser, build.id, { deletedAt: dayjs().toISOString() })
                        expect(deletedBuild).toHaveProperty('deletedAt')
                        expect(deletedBuild.deletedAt).not.toBeNull()
                    })
                    test('Cannot update anything for other apps', async () => {
                        await expectToThrowAccessDeniedErrorToObj(async () => {
                            await updateTestB2CAppBuild(anotherPermittedUser, build.id, {})
                        })
                    })
                })
                test('Cannot update otherwise', async () => {
                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestB2CAppBuild(user, build.id, {})
                    })
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestB2CAppBuild(anonymous, build.id, {})
                })
            })
        })
        describe('Read', () => {
            let build
            beforeAll(async () => {
                [build] = await createTestB2CAppBuild(admin, app)
            })
            test('Admin can', async () => {
                const anotherAdmin = await makeLoggedInAdminClient()
                const builds = await B2CAppBuild.getAll(anotherAdmin, { id: build.id })
                expect(builds).toBeDefined()
                expect(builds).toHaveLength(1)
                expect(builds[0]).toHaveProperty('id', build.id)
            })
            test('Support can', async () => {
                const builds = await B2CAppBuild.getAll(support, { id: build.id })
                expect(builds).toBeDefined()
                expect(builds).toHaveLength(1)
                expect(builds[0]).toHaveProperty('id', build.id)
            })
            describe('User', () => {
                describe('User with access right',  () => {
                    test('To linked B2B app can', async () => {
                        const builds = await B2CAppBuild.getAll(permittedUser, { id: build.id })
                        expect(builds).toBeDefined()
                        expect(builds).toHaveLength(1)
                        expect(builds[0]).toHaveProperty('id', build.id)
                    })
                    test('To other app - cannot', async () => {
                        const builds = await B2CAppBuild.getAll(anotherPermittedUser, { id: build.id })
                        expect(builds).toBeDefined()
                        expect(builds).toHaveLength(0)
                    })
                })
                test('Cannot otherwise', async () => {
                    const builds = await B2CAppBuild.getAll(user, { id: build.id })
                    expect(builds).toBeDefined()
                    expect(builds).toHaveLength(0)
                })
            })
            test('Anonymous cannot', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await B2CAppBuild.getAll(anonymous, { id: build.id })
                })
            })
        })
        describe('Delete', () => {
            let build
            beforeAll(async () => {
                [build] = await createTestB2CAppBuild(admin, app)
            })
            test('Nobody can', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(admin, build.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(support, build.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(permittedUser, build.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(anotherPermittedUser, build.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(user, build.id)
                })
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await B2CAppBuild.delete(anonymous, build.id)
                })
            })
        })
    })
    describe('Validations', () => {
        test('Cannot accept non-zip archive file', async () => {
            await expectToThrowValidationFailureError(async () => {
                await createTestB2CAppBuild(admin, app, {
                    data: new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/dino.png')),
                })
            }, NON_ZIP_FILE_ERROR)
        })
        test('Service account cannot create build linked to non-permitted app or change link to another app', async () => {
            const [secondApp] = await createTestB2CApp(admin)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestB2CAppBuild(permittedUser, secondApp)
            })
            const [build] = await createTestB2CAppBuild(permittedUser, app)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestB2CAppBuild(permittedUser, build.id, {
                    app: { connect: { id: secondApp.id } },
                })
            })
        })
        test('Must contains app link on creation', async () => {
            const testAppMock = { id: faker.datatype.uuid() }
            await expectToThrowValidationFailureError(async () => {
                await createTestB2CAppBuild(admin, testAppMock, {
                    app: null,
                })
            }, NO_APP_ERROR)
        })
        describe('Auto-delete',  () => {
            test('On removing from app\'s build list', async () => {
                const [app] = await createTestB2CApp(admin)
                const [build] = await createTestB2CAppBuild(admin, app)
                await updateTestB2CApp(admin, app.id, {
                    builds: { disconnect: { id: build.id } },
                })

            })
        })
    })
})
