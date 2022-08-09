/**
 * Generated by `createschema notification.MessageOrganizationBlackList 'organization?:Relationship:Organization:CASCADE; description:Text'`
 */
const faker = require('faker')

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE, waitFor } = require('@condo/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects,
} = require('@condo/domains/common/utils/testSchema')

const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser, createTestEmail, createTestPhone } = require('@condo/domains/user/utils/testSchema')

const { MessageOrganizationBlackList, createTestMessageOrganizationBlackList, updateTestMessageOrganizationBlackList, Message } = require('@condo/domains/notification/utils/testSchema')
const { makeClientWithRegisteredOrganization, inviteNewOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema/Organization')
const { DIRTY_INVITE_NEW_EMPLOYEE_MESSAGE_TYPE, MESSAGE_ERROR_STATUS } = require('@condo/domains/notification/constants/constants')

describe('MessageOrganizationBlackList', () => {
    describe('accesses', () => {
        describe('create', () => {
            it('support can create MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()

                const [blackList] = await createTestMessageOrganizationBlackList(supportClient)

                expect(blackList.id).toMatch(UUID_RE)
            })

            it('user cannot create MessageOrganizationBlackList', async () => {
                const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestMessageOrganizationBlackList(userClient)
                })
            })

            it('anonymous cannot create MessageOrganizationBlackList', async () => {
                const anonymousClient = await makeClient()

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestMessageOrganizationBlackList(anonymousClient)
                })
            })
        })

        describe('update', () => {
            it('support can update MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()

                const [blackList] = await createTestMessageOrganizationBlackList(supportClient)
                const description = faker.random.alphaNumeric(8)

                const [updatedBlackList] = await updateTestMessageOrganizationBlackList(supportClient, blackList.id, {
                    description,
                })

                expect(updatedBlackList.description).toEqual(description)
            })

            it('user cannot update MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()
                const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

                const [blackList] = await createTestMessageOrganizationBlackList(supportClient)
                const description = faker.random.alphaNumeric(8)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestMessageOrganizationBlackList(userClient, blackList.id, {
                        description,
                    })
                })
            })

            it('anonymous cannot update MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()
                const anonymousClient = await makeClient()

                const [blackList] = await createTestMessageOrganizationBlackList(supportClient)
                const description = faker.random.alphaNumeric(8)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestMessageOrganizationBlackList(anonymousClient, blackList.id, {
                        description,
                    })
                })
            })
        })

        describe('read', () => {
            it('user cannot read MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()
                const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

                await createTestMessageOrganizationBlackList(supportClient)

                await expectToThrowAccessDeniedErrorToObjects(async () => {
                    await MessageOrganizationBlackList.getAll(userClient)
                })
            })

            it('anonymous cannot read MessageOrganizationBlackList', async () => {
                const supportClient = await makeClientWithSupportUser()
                const anonymousClient = await makeClient()

                await createTestMessageOrganizationBlackList(supportClient)

                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await MessageOrganizationBlackList.getAll(anonymousClient)
                })
            })
        })
    })
})
