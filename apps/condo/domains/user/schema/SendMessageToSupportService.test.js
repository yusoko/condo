/**
 * Generated by `createservice user.SendMessageToSupportService`
 */

const { supportSendMessageToSupportByTestClient } = require('@condo/domains/user/utils/testSchema')
const { MESSAGE_SENDING_STATUS } = require('@condo/domains/notification/constants/constants')
const { RU_LOCALE } = require('@condo/domains/common/constants/locale')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const conf = require('@core/config')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { makeLoggedInAdminClient, UploadingFile } = require('@core/keystone/test.utils')
const { createTestResident } = require('@condo/domains/resident/utils/testSchema')
const { addResidentAccess } = require('@condo/domains/user/utils/testSchema')
const { registerNewOrganization } = require('@condo/domains/organization/utils/testSchema/Organization')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { Message } = require('@condo/domains/notification/utils/testSchema')
const path = require('path')
const { makeClientWithResidentAccessAndProperty } = require('@condo/domains/property/utils/testSchema')
const { catchErrorFrom } = require('@condo/domains/common/utils/testSchema')

const EMAIL_FROM = 'doma-test-message-to-support@mailforspam.com'

describe('SendMessageToSupportService', () => {
    test('with attachments, with emailFrom', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()
        await createTestResident(adminClient, userClient.user, userClient.property)

        const os = 'android v11'

        const payload = {
            os,
            attachments: [
                new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/simple-text-file.txt')),
                new UploadingFile(path.resolve(conf.PROJECT_ROOT, 'apps/condo/domains/common/test-assets/dino.png')),
            ],
            text: `Test message from resident to support. This message should be sent from ${EMAIL_FROM} and contains an attachment.`,
            emailFrom: EMAIL_FROM, // email passed from mobile application
            appVersion: '0.0.1a',
            lang: RU_LOCALE,
            meta: {},
        }

        const [result] = await supportSendMessageToSupportByTestClient(userClient, payload)
        expect(result.status).toEqual(MESSAGE_SENDING_STATUS)

        const messages = await Message.getAll(adminClient, { id: result.id })
        expect(messages).toHaveLength(1)
        expect(messages[0].meta.attachments).toHaveLength(2)
        expect(messages[0].meta.os).toEqual(os)
    })

    test('no attachments, wrong email', async () => {
        const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {
            text: 'Test with wrong email.',
            emailFrom: 'some-wrong_email',
            os: 'android 13',
            appVersion: '0.0.1a',
            lang: RU_LOCALE,
            meta: {},
        }

        await catchErrorFrom(async () => {
            await supportSendMessageToSupportByTestClient(userClient, payload)
        }, ({ errors }) => {
            expect(errors).toMatchObject([{
                message: 'api.user.sendMessageToSupport.WRONG_EMAIL_FORMAT',
                path: ['result'],
                extensions: {
                    mutation: 'sendMessageToSupport',
                    variable: ['data', 'emailFrom'],
                    code: 'BAD_USER_INPUT',
                    type: 'WRONG_FORMAT',
                    message: 'api.user.sendMessageToSupport.WRONG_EMAIL_FORMAT',
                },
            }])
        })
    })

    test('no attachments', async () => {
        const residentClient = await makeClientWithResidentAccessAndProperty()
        const adminClient = await makeLoggedInAdminClient()
        await createTestResident(adminClient, residentClient.user, residentClient.property)

        const payload = {
            text: `Test message from resident to support. This message should be sent from ${EMAIL_FROM}`,
            emailFrom: EMAIL_FROM, // email passed from mobile application
            os: 'android 8',
            appVersion: '0.0.1a',
            lang: RU_LOCALE,
            meta: {},
        }

        const [result] = await supportSendMessageToSupportByTestClient(residentClient, payload)
        expect(result.status).toEqual(MESSAGE_SENDING_STATUS)
        const messages = await Message.getAll(adminClient, { id: result.id })
        expect(messages).toHaveLength(1)
    })

    test('synthetic test with two organizations', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()
        const [organization] = await registerNewOrganization(userClient)
        const [property] = await createTestProperty(adminClient, organization)

        await createTestResident(adminClient, userClient.user, userClient.property)
        await createTestResident(adminClient, userClient.user, organization, property)
        await addResidentAccess(userClient.user)

        const payload = {
            text: `Test message from resident to support. This message should be sent from ${EMAIL_FROM}. Resident must be attached to two organizations.`,
            emailFrom: EMAIL_FROM, // email passed from mobile application
            os: 'ios 15.1',
            appVersion: '0.0.1a',
            lang: RU_LOCALE,
            meta: {},
        }

        const [result] = await supportSendMessageToSupportByTestClient(userClient, payload)
        expect(result.status).toEqual(MESSAGE_SENDING_STATUS)

        const messages = await Message.getAll(adminClient, { id: result.id })
        expect(messages).toHaveLength(1)
        expect(messages[0].meta.organizationsData).toHaveLength(2)
    })

    test('no attachments, no email', async () => {
        const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
        const payload = {
            text: 'Test message from resident to support. In this message resident has not passed the email address, so the sender\'s email is default',
            os: 'android 12',
            appVersion: '0.0.1a',
            lang: RU_LOCALE,
            meta: {},
        }

        const [result] = await supportSendMessageToSupportByTestClient(userClient, payload)
        expect(result.status).toEqual(MESSAGE_SENDING_STATUS)
    })
})