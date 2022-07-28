/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 */

const { WRONG_EMAIL_ERROR } = require('@condo/domains/user/constants/errors')
const { getRandomString, makeLoggedInAdminClient, makeClient, DEFAULT_TEST_ADMIN_IDENTITY, DEFAULT_TEST_USER_SECRET } = require('@core/keystone/test.utils')

const {
    User,
    UserAdmin,
    createTestUser,
    updateTestUser,
    makeClientWithNewRegisteredAndLoggedInUser,
    makeLoggedInClient,
    createTestLandlineNumber,
    createTestPhone,
    createTestEmail,
    makeClientWithResidentUser,
} = require('@condo/domains/user/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects, expectToThrowGQLError } = require('@condo/domains/common/utils/testSchema')
const { GET_MY_USERINFO, SIGNIN_MUTATION } = require('@condo/domains/user/gql')
const { DEFAULT_TEST_USER_IDENTITY } = require('@core/keystone/test.utils')
const { WRONG_PASSWORD_ERROR, EMPTY_PASSWORD_ERROR } = require('@condo/domains/user/constants/errors')
const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { generateGQLTestUtils } = require('@condo/domains/common/utils/codegeneration/generate.test.utils')

describe('SIGNIN', () => {
    test('anonymous: SIGNIN_MUTATION', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': DEFAULT_TEST_USER_IDENTITY,
            'secret': DEFAULT_TEST_USER_SECRET,
        })
        expect(errors).toEqual(undefined)
        expect(data.obj.item.id).toMatch(/[a-zA-Z0-9-_]+/)
    })

    test('anonymous: GET_MY_USERINFO', async () => {
        const client = await makeClient()
        const { data, errors } = await client.query(GET_MY_USERINFO)
        expect(errors).toEqual(undefined)
        expect(data).toEqual({ 'user': null })
    })

    test('user: GET_MY_USERINFO', async () => {
        const client = await makeLoggedInClient()
        const { data, errors } = await client.query(GET_MY_USERINFO)
        expect(errors).toEqual(undefined)
        expect(data.user).toEqual(expect.objectContaining({ id: client.user.id }))
    })

    test('anonymous: SIGNIN_MUTATION by wrong password', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': DEFAULT_TEST_USER_IDENTITY,
            'secret': 'wrong password',
        })
        expect(data).toEqual({ 'obj': null })
        expect(JSON.stringify(errors)).toMatch((WRONG_PASSWORD_ERROR))
    })

    test('anonymous: SIGNIN_MUTATION by wrong email', async () => {
        const client = await makeClient()
        const { data, errors } = await client.mutate(SIGNIN_MUTATION, {
            'identity': 'some3571592131usermail@example.com',
            'secret': 'wrong password',
        })
        expect(data).toEqual({ 'obj': null })
        expect(JSON.stringify(errors)).toMatch(WRONG_EMAIL_ERROR)
    })

    test('check auth by empty password', async () => {
        const admin = await makeLoggedInAdminClient()
        const [, userAttrs] = await createTestUser(admin, { password: '' })
        const checkAuthByEmptyPassword = async () => {
            await makeLoggedInClient({ email: userAttrs.email, password: '' })
        }
        await expect(checkAuthByEmptyPassword).rejects.toThrow(EMPTY_PASSWORD_ERROR)
    })
})

describe('User', () => {
    test('user: create User', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await createTestUser(client)
        })
    })

    test('anonymous: create User', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestUser(client)
        })
    })

    test('user: read User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [anotherUser] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const { data } = await UserAdmin.getAll(client, {}, { raw: true, sortBy: ['updatedAt_DESC'] })
        expect(data.objs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: client.user.id, email: client.userAttrs.email, phone: client.userAttrs.phone }),
                expect.objectContaining({ id: anotherUser.id, email: null, phone: null }),
            ]),
        )
        expect(data.objs.length >= 1).toBeTruthy()
    })

    test('anonymous: read User', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObjects(async () => {
            await User.getAll(client)
        })
    })

    test('user: update self User', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {}
        const [obj, attrs] = await updateTestUser(client, client.user.id, payload)
        expect(obj.updatedBy).toMatchObject({ id: client.user.id })
        expect(obj.sender).toMatchObject(attrs.sender)
        expect(obj.v).toBeGreaterThan(client.user.v)
    })

    test('user: update self User phone should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { phone: createTestPhone() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    // TODO(pahaz): !!! remove this test in the FUTURE
    test('user: update self resident phone should ok', async () => {
        const client = await makeClientWithResidentUser()
        const payload = { phone: client.userAttrs.phone }
        await updateTestUser(client, client.user.id, payload)

        const objs = await UserAdmin.getAll(client, { id: client.user.id })
        expect(objs[0]).toEqual(expect.objectContaining({ phone: client.userAttrs.phone }))
    })

    // TODO(pahaz): !!! unskip!
    test.skip('user: update self User email should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { email: createTestEmail() }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    test('user: update self User name', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { name: createTestEmail() }
        const [obj] = await updateTestUser(client, client.user.id, payload)
        expect(obj.name).toEqual(payload.name)
    })

    test('user: update self User isAdmin should fail', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = { isAdmin: true }
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, client.user.id, payload)
        })
    })

    test('user: update self User password', async () => {
        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const password = getRandomString()
        const payload = { password }
        const [obj, attrs] = await updateTestUser(client, client.user.id, payload)
        expect(obj.updatedBy).toMatchObject({ id: client.user.id })
        expect(obj.sender).toMatchObject(attrs.sender)
        expect(obj.v).toBeGreaterThan(client.user.v)

        const client2 = await makeLoggedInClient({ phone: client.userAttrs.phone, password })
        expect(client2.user.id).toEqual(client.user.id)
    })

    test('user: update another User should fail', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {}
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await updateTestUser(client, objCreated.id, payload)
        })
    })

    test('anonymous: update User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClient()
        const payload = {}
        await expectToThrowAuthenticationErrorToObj(async () => {
            await updateTestUser(client, objCreated.id, payload)
        })
    })

    test('user: delete User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClientWithNewRegisteredAndLoggedInUser()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await User.delete(client, objCreated.id)
        })
    })

    test('anonymous: delete User', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestUser(admin)

        const client = await makeClient()
        await expectToThrowAccessDeniedErrorToObj(async () => {
            await User.delete(client, objCreated.id)
        })
    })

    test('anonymous: count', async () => {
        const client = await makeClient()
        const { data, errors } = await User.count(client, {}, { raw: true })
        expect(data).toEqual({ meta: { count: null } })
        expect(errors[0]).toMatchObject({
            'message': 'No or incorrect authentication credentials',
            'name': 'AuthenticationError',
            'path': ['meta', 'count'],
        })
    })

    test('user: count', async () => {
        const admin = await makeLoggedInAdminClient()
        const [, userAttrs] = await createTestUser(admin)
        const client = await makeLoggedInClient(userAttrs)
        const count = await User.count(client)
        expect(count).toBeGreaterThanOrEqual(2)
    })
})

describe('User utils', () => {
    test('createUser()', async () => {
        const admin = await makeLoggedInAdminClient()
        const [user, userAttrs] = await createTestUser(admin)
        expect(user.id).toMatch(/^[A-Za-z0-9-]+$/g)
        expect(userAttrs.email).toBeTruthy()
        expect(userAttrs.password).toBeTruthy()
    })

    test('createUser() with wrong dv', async () => {
        const admin = await makeLoggedInAdminClient()
        await expectToThrowGQLError(async () => await createTestUser(admin, { dv: 7 }), {
            'code': 'BAD_USER_INPUT',
            'type': 'DV_VERSION_MISMATCH',
            'message': 'Wrong value for data version number',
            'mutation': 'createUser',
            'messageForUser': '',
            'variable': ['data', 'dv'],
        })
    })

    test('createUser() with wrong sender dv', async () => {
        const admin = await makeLoggedInAdminClient()
        await expectToThrowGQLError(async () => await createTestUser(admin, { sender: { dv: 2, fingerprint: '<errrr>' } }), {
            'code': 'BAD_USER_INPUT',
            'type': 'WRONG_FORMAT',
            'correctExample': '{ dv: 1, fingerprint: \'example-fingerprint-alphanumeric-value\'}',
            'message': 'Invalid format of "sender" field value. {details}',
            'mutation': 'createUser',
            'messageInterpolation': { 'details': 'fingerprint: [\'Fingerprint is invalid\'], dv: [\'Dv must be equal to 1\']' },
            'variable': ['data', 'sender'],
        })
    })

    test('createUser() with wrong sender fingerprint', async () => {
        const admin = await makeLoggedInAdminClient()
        await expectToThrowGQLError(async () => await createTestUser(admin, { sender: { dv: 1, fingerprint: '<errrr>' } }), {
            'code': 'BAD_USER_INPUT',
            'type': 'WRONG_FORMAT',
            'correctExample': '{ dv: 1, fingerprint: \'example-fingerprint-alphanumeric-value\'}',
            'message': 'Invalid format of "sender" field value. {details}',
            'mutation': 'createUser',
            'messageInterpolation': { 'details': 'fingerprint: [\'Fingerprint is invalid\']' },
            'variable': ['data', 'sender'],
        })
    })

    test('createUser() with landline phone number', async () => {
        const admin = await makeLoggedInAdminClient()
        const phone = createTestLandlineNumber()

        const { data, errors } = await createTestUser(admin, { phone }, { raw: true })

        expect(data).toEqual({ 'obj': null })
        expect(errors).toMatchObject([{
            message: 'You attempted to perform an invalid mutation',
            name: 'ValidationFailureError',
            path: ['obj'],
            data: {
                messages: ['[format:phone] invalid format'],
            },
        }])
    })

    test('makeLoggedInClient() without arguments', async () => {
        const admin = await makeLoggedInAdminClient()
        const client = await makeLoggedInClient()
        const userObj = await UserAdmin.getOne(admin, { id: client.user.id })
        expect(userObj).toMatchObject({
            email: DEFAULT_TEST_USER_IDENTITY,
            isAdmin: false,
            isSupport: false,
            type: 'staff',
        })
        const adminObj = await UserAdmin.getOne(admin, { id: admin.user.id })
        expect(adminObj).toMatchObject({
            email: DEFAULT_TEST_ADMIN_IDENTITY,
            isAdmin: true,
            isSupport: false,
            type: 'staff',
        })
    })
})

describe('User fields', () => {
    test('Convert email to lower case', async () => {
        const admin = await makeLoggedInAdminClient()
        const email = 'XXX' + getRandomString() + '@example.com'
        const [user, userAttrs] = await createTestUser(admin, { email })

        const objs = await UserAdmin.getAll(admin, { id: user.id })
        expect(objs[0]).toEqual(expect.objectContaining({ email: email.toLowerCase(), id: user.id }))

        const client2 = await makeLoggedInClient({ password: userAttrs.password, email: email.toLowerCase() })
        expect(client2.user.id).toEqual(user.id)

        // TODO(pahaz): fix in a future (it's no OK if you can't logged in by upper case email)
        const checkAuthByUpperCaseEmail = async () => {
            await makeLoggedInClient(userAttrs)
        }
        await expect(checkAuthByUpperCaseEmail).rejects.toThrow(WRONG_EMAIL_ERROR)
    })
})

const COMMON_FIELDS = 'id dv sender v deletedAt newId createdBy updatedBy createdAt updatedAt'
const HISTORY_FIELDS = 'history_id history_action history_date'
const USER_HISTORY_FIELDS = `{ ${HISTORY_FIELDS} name avatar meta type isPhoneVerified isEmailVerified importId importRemoteSystem ${COMMON_FIELDS} }`
const UserHistoryAdminGQL = generateGqlQueries('UserHistoryRecord', USER_HISTORY_FIELDS)
const UserHistoryAdmin = generateGQLTestUtils(UserHistoryAdminGQL)

describe('UserHistoryRecord', () => {
    test('create/update action generate history records', async () => {
        const admin = await makeLoggedInAdminClient()
        const name = getRandomString()

        const [user] = await createTestUser(admin)
        await User.update(admin, user.id, { name })

        const objs = await UserHistoryAdmin.getAll(admin, { history_id: user.id }, { sortBy: ['history_date_ASC'] })
        expect(objs).toMatchObject([
            {
                history_id: user.id,
                history_action: 'c',
                name: user.name,
                avatar: user.avatar,
                meta: user.meta,
                type: user.type,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified,
                importId: user.importId,
                importRemoteSystem: user.importRemoteSystem,
                dv: 1,
                sender: user.sender,
                v: 1,
                deletedAt: null,
                newId: null,
                createdBy: admin.user.id,
                updatedBy: admin.user.id,
            },
            {
                history_id: user.id,
                history_action: 'u',
                name,
                avatar: user.avatar,
                meta: user.meta,
                type: user.type,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified,
                importId: user.importId,
                importRemoteSystem: user.importRemoteSystem,
                dv: 1,
                sender: user.sender,
                v: 2,
                deletedAt: null,
                newId: null,
                createdBy: admin.user.id,
                updatedBy: admin.user.id,
            },
        ])
    })
})
