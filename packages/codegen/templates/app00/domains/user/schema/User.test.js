/**
 * Generated by `createschema condo.User 'name:Text; isSupport:Checkbox; isAdmin:Checkbox; email:Text;'`
 */

const {
    makeLoggedInAdminClient, makeClient, UUID_RE,
    DATETIME_RE,
    expectToThrowAuthenticationError,
    expectToThrowGQLError,
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
} = require('@open-condo/keystone/test.utils')

const {
    User, createTestUser, updateTestUser,
    makeClientWithNewRegisteredAndLoggedInUser,
    makeClientWithSupportUser,
} = require('@{{name}}/domains/user/utils/testSchema')


describe('User', () => {
    let admin, support, userClient, anonymous

    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()
    })

    describe('Accesses', () => {
        describe('Admin', () => {
            test('can create', async () => {
                const [user, attrs] = await createTestUser(admin)

                expect(user.id).toMatch(UUID_RE)
                expect(user.dv).toEqual(1)
                expect(user.sender).toEqual(attrs.sender)
                expect(user.v).toEqual(1)
                expect(user.newId).toEqual(null)
                expect(user.deletedAt).toEqual(null)
                expect(user.createdBy).toEqual(expect.objectContaining({ id: admin.user.id }))
                expect(user.updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
                expect(user.createdAt).toMatch(DATETIME_RE)
                expect(user.updatedAt).toMatch(DATETIME_RE)
            })

            test('can update', async () => {
                const [user] = await createTestUser(admin)

                const [obj, attrs] = await updateTestUser(admin, user.id)

                expect(obj.dv).toEqual(1)
                expect(obj.sender).toEqual(attrs.sender)
                expect(obj.v).toEqual(2)
            })

            test('can read any users', async () => {
                const users = await User.getAll(admin, {
                    id_in: [admin.user.id, support.user.id, userClient.user.id],
                })

                expect(users).toHaveLength(3)
                expect(users).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: admin.user.id }),
                    expect.objectContaining({ id: support.user.id }),
                    expect.objectContaining({ id: userClient.user.id }),
                ]))
            })

            test('can\'t hard delete', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await User.delete(admin, user.id)
                })
            })
        })

        describe('Support', () => {
            test('can\'t create', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestUser(support)
                })
            })

            test('can\'t update', async () => {
                const [user] = await createTestUser(admin)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestUser(support, user.id)
                })
            })

            test('can read any user', async () => {
                const users = await User.getAll(support, {
                    id_in: [admin.user.id, support.user.id, userClient.user.id],
                })

                expect(users).toHaveLength(3)
                expect(users).toEqual(expect.arrayContaining([
                    expect.objectContaining({ id: admin.user.id }),
                    expect.objectContaining({ id: support.user.id }),
                    expect.objectContaining({ id: userClient.user.id }),
                ]))
            })

            test('can\'t hard delete', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await User.delete(support, user.id)
                })
            })
        })

        describe('User', () => {
            test('can\'t create', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestUser(userClient)
                })
            })

            test('can\'t update', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestUser(userClient, user.id)
                })
            })

            test('can\'t hard delete', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await User.delete(userClient, user.id)
                })
            })
        })

        describe('Anonymous', () => {
            test('can\'t create', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestUser(anonymous)
                })
            })

            test('can\'t update', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAuthenticationError(async () => {
                    await updateTestUser(anonymous, user.id)
                }, 'obj')
            })

            test('can\'t read', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await User.getAll(anonymous, {
                        id_in: [admin.user.id, support.user.id, userClient.user.id],
                    })
                })
            })

            test('can\'t hard delete', async () => {
                const [user] = await createTestUser(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await User.delete(anonymous, user.id)
                })
            })
        })
    })

    describe('Validation tests', () => {
        test('Should have correct dv field (=== 1)', async () => {
            const admin = await makeLoggedInAdminClient()

            await expectToThrowGQLError(
                async () => await createTestUser(admin, { dv: 100500 }),
                {
                    'code': 'BAD_USER_INPUT',
                    'type': 'DV_VERSION_MISMATCH',
                    'message': 'Wrong value for data version number',
                    'mutation': 'createUser',
                    'variable': ['data', 'dv'],
                },
            )
        })
    })
})
