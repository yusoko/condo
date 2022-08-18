/**
 * Generated by `createschema ticket.TicketExportTask 'status:Select:processing,completed,error; format:Select:excel; exportedRecordsCount:Integer; totalRecordsCount:Integer; file?:File; meta?:Json'`
 */
const difference = require('lodash/difference')
const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE } = require('@condo/keystone/test.utils')

const { TicketExportTask, createTestTicketExportTask, updateTestTicketExportTask } = require('@condo/domains/ticket/utils/testSchema')
const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAccessDeniedErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
} = require('@condo/domains/common/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')
const { EXPORT_STATUS_VALUES, PROCESSING, CANCELLED } = require('@condo/domains/common/constants/export')

describe('TicketExportTask', () => {
    describe('validations', () => {
        test.todo('cannot have PROCESSING status on create')
    })

    describe('Create', () => {
        it('cannot be created by anonymous', async () => {
            const anonymousClient = await makeClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestTicketExportTask(anonymousClient, userClient.user)
            })
        })

        it('cannot be created by user for another user', async () => {
            const firstUserClient = await makeClientWithNewRegisteredAndLoggedInUser()
            const secondUserClient = await makeClientWithNewRegisteredAndLoggedInUser()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestTicketExportTask(firstUserClient, secondUserClient.user)
            })
        })

        it('can be created by user for itself', async () => {
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

            const [obj, attrs] = await createTestTicketExportTask(userClient, userClient.user)
            expect(obj.id).toMatch(UUID_RE)
            expect(obj.dv).toEqual(1)
            expect(obj.sender).toEqual(attrs.sender)
            expect(obj.v).toEqual(1)
            expect(obj.newId).toEqual(null)
            expect(obj.deletedAt).toEqual(null)
            expect(obj.createdBy).toEqual(expect.objectContaining({ id: userClient.user.id }))
            expect(obj.updatedBy).toEqual(expect.objectContaining({ id: userClient.user.id }))
            expect(obj.createdAt).toMatch(DATETIME_RE)
            expect(obj.updatedAt).toMatch(DATETIME_RE)
        })

        it('cannot be created by user for nobody', async () => {
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestTicketExportTask(userClient, userClient.user, { user: null })
            })
        })

        it('can be created by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()

            const [obj, attrs] = await createTestTicketExportTask(adminClient, adminClient.user)
            expect(obj.id).toMatch(UUID_RE)
            expect(obj.dv).toEqual(1)
            expect(obj.sender).toEqual(attrs.sender)
            expect(obj.v).toEqual(1)
            expect(obj.newId).toEqual(null)
            expect(obj.deletedAt).toEqual(null)
            expect(obj.createdBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
            expect(obj.updatedBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
            expect(obj.createdAt).toMatch(DATETIME_RE)
            expect(obj.updatedAt).toMatch(DATETIME_RE)
        })
    })

    describe('Read', () => {
        it('can be read by user who is associated with this record', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient1 = await makeClientWithNewRegisteredAndLoggedInUser()
            const userClient2 = await makeClientWithNewRegisteredAndLoggedInUser()
            const userClient3 = await makeClientWithNewRegisteredAndLoggedInUser()

            const [obj1] = await createTestTicketExportTask(adminClient, userClient1.user)
            const [obj2] = await createTestTicketExportTask(adminClient, userClient2.user)

            const records1 = await TicketExportTask.getAll(userClient1)
            expect(records1).toHaveLength(1)
            expect(records1).toMatchObject([obj1])

            const records2 = await TicketExportTask.getAll(userClient2)
            expect(records2).toHaveLength(1)
            expect(records2).toMatchObject([obj2])

            const records3 = await TicketExportTask.getAll(userClient3)
            expect(records3).toHaveLength(0)
        })

        it('can be read by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()

            await createTestTicketExportTask(adminClient, adminClient.user)
            await createTestTicketExportTask(adminClient, userClient.user)

            const records = await TicketExportTask.getAll(adminClient, {}, { sortBy: ['updatedAt_DESC'] })
            expect(records.length).toBeGreaterThanOrEqual(2)
        })

        it('cannot be read by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const anonymousClient = await makeClient()

            await createTestTicketExportTask(adminClient, adminClient.user)

            await expectToThrowAuthenticationErrorToObjects(async () => {
                await TicketExportTask.getAll(anonymousClient)
            })
        })
    })

    describe('Update', () => {
        it('can be updated by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const [obj, attrs] = await createTestTicketExportTask(adminClient, adminClient.user)
            const newAttrs = {
                status: difference(EXPORT_STATUS_VALUES, [attrs.status])[0],
            }
            const [updatedObj] = await updateTestTicketExportTask(adminClient, obj.id, newAttrs)
            expect(updatedObj.status).toEqual(newAttrs.status)
        })

        it('can be updated by user with specifying "cancelled" value for "status" field', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user, {
                status: PROCESSING,
            })
            const [objUpdated] = await updateTestTicketExportTask(userClient, obj.id, { status: CANCELLED })
            expect(objUpdated.status).toEqual(CANCELLED)
        })

        const forbiddenFieldsToUpdateByUser = {
            exportedRecordsCount: 99,
            format: 'excel',
            totalRecordsCount: 99,
            meta: {},
            where: {},
            sortBy: ['order_ASC', 'createdAt_DESC'],
            locale: 'en',
            timeZone: 'Europe/Moscow',
            user: { connect: { id: '123' } },
        }

        test.each(Object.keys(forbiddenFieldsToUpdateByUser))('cannot be updated by user with specifying value for %p field', async (field) => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user, {
                status: PROCESSING,
            })
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestTicketExportTask(userClient, obj.id, { [field]: forbiddenFieldsToUpdateByUser[field] })
            })
        })

        it('cannot be updated by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const anonymousClient = await makeClient()
            const [obj, attrs] = await createTestTicketExportTask(adminClient, adminClient.user)
            const newAttrs = {
                status: difference(EXPORT_STATUS_VALUES, [attrs.status])[0],
            }
            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestTicketExportTask(anonymousClient, obj.id, newAttrs)
            })
        })
    })

    describe('Delete', () => {

        it('can be soft-deleted by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)

            const [objUpdated, attrs] = await TicketExportTask.softDelete(adminClient, obj.id)

            expect(objUpdated.id).toEqual(obj.id)
            expect(objUpdated.dv).toEqual(1)
            expect(objUpdated.sender).toEqual(attrs.sender)
            expect(objUpdated.deletedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
        })

        it('cannot be soft-deleted by user', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await TicketExportTask.softDelete(userClient, obj.id)
            })
        })

        it('cannot be soft-deleted by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const anonymousClient = await makeClient()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)
            await expectToThrowAuthenticationErrorToObj(async () => {
                await TicketExportTask.softDelete(anonymousClient, obj.id)
            })
        })

        it('cannot be deleted by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await TicketExportTask.delete(adminClient, obj.id)
            })
        })

        it('cannot be deleted by user', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithNewRegisteredAndLoggedInUser()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await TicketExportTask.delete(userClient, obj.id)
            })
        })

        it('cannot be deleted by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const anonymousClient = await makeClient()
            const [obj] = await createTestTicketExportTask(adminClient, adminClient.user)
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await TicketExportTask.delete(anonymousClient, obj.id)
            })
        })
    })

})
