/**
 * Generated by `createschema ticket.TicketPropertyHintProperty 'organization:Relationship:Organization:CASCADE;ticketPropertyHint:Relationship:TicketPropertyHint:CASCADE; property:Relationship:Property:SET_NULL;'`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE } = require('@core/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj, expectToThrowInternalError,
} = require('@condo/domains/common/utils/testSchema')

const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const { TicketPropertyHintProperty, createTestTicketPropertyHintProperty, updateTestTicketPropertyHintProperty, createTestTicketPropertyHint, updateTestTicketPropertyHint } = require('@condo/domains/ticket/utils/testSchema')
const { createTestOrganization, createTestOrganizationEmployeeRole, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestProperty, updateTestProperty } = require('@condo/domains/property/utils/testSchema')
const { UNIQUE_CONSTRAINT_ERROR } = require('@condo/domains/common/constants/errors')

describe('TicketPropertyHintProperty', () => {
    describe('CRUD tests', () => {
        describe('create', () => {
            describe('admin', () => {
                it('admin can create TicketPropertyHintProperty', async () => {
                    const admin = await makeLoggedInAdminClient()

                    const [organization] = await createTestOrganization(admin)
                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    const [obj] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

                    expect(obj.id).toMatch(UUID_RE)
                })
            })

            describe('user', () => {
                it('can create TicketPropertyHintProperty in the organization in which he is an employee with "canManageTicketPropertyHints" is true', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                        canManageTicketPropertyHints: true,
                    })
                    await createTestOrganizationEmployee(admin, organization, user.user, role)

                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(user, organization, {})

                    const [obj] = await createTestTicketPropertyHintProperty(user, ticketPropertyHint, property)

                    expect(obj.id).toMatch(UUID_RE)
                })

                it('cannot create TicketPropertyHintProperty in the organization in which he is not an employee', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()

                    const [organization] = await createTestOrganization(admin)
                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestTicketPropertyHintProperty(user, ticketPropertyHint, property)
                    })
                })

                it('cannot create TicketPropertyHintProperty in the organization in which he is an employee with "canManageTicketPropertyHints" is false', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                    await createTestOrganizationEmployee(admin, organization, user.user, role)

                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await createTestTicketPropertyHintProperty(user, ticketPropertyHint, property)
                    })
                })
            })

            describe('anonymous', function () {
                it('anonymous can\'t create TicketPropertyHintProperty', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const client = await makeClient()

                    const [organization] = await createTestOrganization(admin)
                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    await expectToThrowAuthenticationErrorToObj(async () => {
                        await createTestTicketPropertyHintProperty(client, ticketPropertyHint, property)
                    })
                })
            })
        })

        describe('update', () => {
            describe('admin', () => {
                it('admin can update TicketPropertyHintProperty', async () => {
                    const admin = await makeLoggedInAdminClient()

                    const [organization] = await createTestOrganization(admin)
                    const [property1] = await createTestProperty(admin, organization)
                    const [property2] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    const [objCreated] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property1)

                    expect(objCreated.property.id).toEqual(property1.id)

                    const [obj] = await updateTestTicketPropertyHintProperty(admin, objCreated.id, {
                        property: { connect: { id: property2.id } },
                    })

                    expect(obj.property.id).toEqual(property2.id)
                })
            })

            describe('user', () => {
                it('can update TicketPropertyHintProperty in the organization in which he is an employee with "canManageTicketPropertyHints" is true', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                        canManageTicketPropertyHints: true,
                    })
                    await createTestOrganizationEmployee(admin, organization, user.user, role)

                    const [property1] = await createTestProperty(admin, organization)
                    const [property2] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(user, organization, {})

                    const [objCreated] = await createTestTicketPropertyHintProperty(user, ticketPropertyHint, property1)

                    expect(objCreated.property.id).toEqual(property1.id)

                    const [obj] = await updateTestTicketPropertyHintProperty(user, objCreated.id, {
                        property: { connect: { id: property2.id } },
                    })

                    expect(obj.property.id).toEqual(property2.id)
                })

                it('cannot update TicketPropertyHintProperty in the organization in which he is an employee with "canManageTicketPropertyHints" is false', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                    await createTestOrganizationEmployee(admin, organization, user.user, role)

                    const [property1] = await createTestProperty(admin, organization)
                    const [property2] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization, {})

                    const [objCreated] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property1)

                    expect(objCreated.property.id).toEqual(property1.id)

                    await expectToThrowAccessDeniedErrorToObj(async () => {
                        await updateTestTicketPropertyHintProperty(user, objCreated.id, {
                            property: { connect: { id: property2.id } },
                        })
                    })
                })
            })

            describe('anonymous', () => {
                it('anonymous can\'t update TicketPropertyHintProperty', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const client = await makeClient()

                    const [organization] = await createTestOrganization(admin)
                    const [property1] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    const [objCreated] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property1)

                    await expectToThrowAuthenticationErrorToObj(async () => {
                        await updateTestTicketPropertyHintProperty(client, objCreated.id)
                    })
                })
            })
        })

        describe('read', () => {
            describe('admin', () => {
                it('admin can read TicketPropertyHintProperty', async () => {
                    const admin = await makeLoggedInAdminClient()

                    const [organization] = await createTestOrganization(admin)
                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

                    const [obj] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

                    const objs = await TicketPropertyHintProperty.getAll(admin, {}, { sortBy: ['updatedAt_DESC'] })

                    expect(objs.length).toBeGreaterThanOrEqual(1)
                    expect(objs).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: obj.id,
                        }),
                    ]))
                })
            })

            describe('user', async () => {
                it('can read TicketPropertyHintProperty in the organization in which he is an employee', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)
                    const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                        canManageTicketPropertyHints: true,
                    })
                    await createTestOrganizationEmployee(admin, organization, user.user, role)

                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(user, organization, {})

                    const [obj] = await createTestTicketPropertyHintProperty(user, ticketPropertyHint, property)

                    const objs = await TicketPropertyHintProperty.getAll(user, {}, { sortBy: ['updatedAt_DESC'] })

                    expect(objs).toHaveLength(1)
                    expect(objs[0]).toMatchObject({
                        id: obj.id,
                    })
                })

                it('cannot read TicketPropertyHintProperty in the organization in which he is not an employee', async () => {
                    const admin = await makeLoggedInAdminClient()
                    const user = await makeClientWithNewRegisteredAndLoggedInUser()
                    const [organization] = await createTestOrganization(admin)

                    const [property] = await createTestProperty(admin, organization)
                    const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization, {})

                    await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

                    const objs = await TicketPropertyHintProperty.getAll(user, {}, { sortBy: ['updatedAt_DESC'] })

                    expect(objs).toHaveLength(0)
                })
            })

            describe('anonymous', () => {
                it('anonymous can\'t read TicketPropertyHintProperty', async () => {
                    const client = await makeClient()

                    await expectToThrowAuthenticationErrorToObjects(async () => {
                        await TicketPropertyHintProperty.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })
                    })
                })
            })
        })
    })

    describe('Validation tests', () => {
        it('uniq ticketPropertyHint and property constraint', async () => {
            const admin = await makeLoggedInAdminClient()

            const [organization] = await createTestOrganization(admin)
            const [property] = await createTestProperty(admin, organization)
            const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

            await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

            await expectToThrowInternalError(async () => {
                await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)
            }, `${UNIQUE_CONSTRAINT_ERROR} "unique_ticketPropertyHint_and_property"`)
        })
    })

    describe('Server-side soft delete tests', async () => {
        it('soft deleted when soft deleting linked property', async () => {
            const admin = await makeLoggedInAdminClient()

            const [organization] = await createTestOrganization(admin)
            const [property] = await createTestProperty(admin, organization)
            const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

            const [ticketPropertyHintProperty] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

            await updateTestProperty(admin, property.id, {
                deletedAt: new Date().toISOString(),
            })

            expect(ticketPropertyHintProperty.deletedAt).toBeDefined()
        })

        it('soft deleted when soft deleting linked ticketPropertyHint', async () => {
            const admin = await makeLoggedInAdminClient()

            const [organization] = await createTestOrganization(admin)
            const [property] = await createTestProperty(admin, organization)
            const [ticketPropertyHint] = await createTestTicketPropertyHint(admin, organization)

            const [ticketPropertyHintProperty] = await createTestTicketPropertyHintProperty(admin, ticketPropertyHint, property)

            await updateTestTicketPropertyHint(admin, ticketPropertyHint.id, {
                deletedAt: new Date().toISOString(),
            })

            expect(ticketPropertyHintProperty.deletedAt).toBeDefined()
        })
    })
})
