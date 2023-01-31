/**
 * Generated by `createschema ticket.IncidentProperty 'incident:Relationship:Incident:CASCADE; property:Relationship:Property:PROTECT; propertyAddress:Text; propertyAddressMeta;'`
 */

const faker = require('faker')

const { makeLoggedInAdminClient, makeClient, catchErrorFrom } = require('@open-condo/keystone/test.utils')
const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAuthenticationErrorToObjects,
    expectToThrowAccessDeniedErrorToObj,
} = require('@open-condo/keystone/test.utils')

const {
    createTestOrganization,
    createTestOrganizationEmployeeRole,
    createTestOrganizationEmployee,
} = require('@condo/domains/organization/utils/testSchema')
const { createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { IncidentProperty, createTestIncidentProperty, updateTestIncidentProperty, createTestIncident } = require('@condo/domains/ticket/utils/testSchema')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')

const { INCIDENT_PROPERTY_ERRORS } = require('../constants/errors')


const DELETED_PAYLOAD = { deletedAt: 'true' }
const INCIDENT_PAYLOAD = {
    details: faker.lorem.sentence(),
    workStart: faker.date.recent().toISOString(),
}

describe('IncidentProperty', () => {
    let admin
    let support
    let employeeUser
    let notEmployeeUser
    let anonymous
    let organization
    let property
    let incidentByAdmin
    let incidentPropertyByAdmin
    beforeAll(async () => {
        admin = await makeLoggedInAdminClient()
        support = await makeClientWithSupportUser()
        employeeUser = await makeClientWithNewRegisteredAndLoggedInUser()
        anonymous = await makeClient()

        const [testOrganization] = await createTestOrganization(admin)
        organization = testOrganization

        const [role] = await createTestOrganizationEmployeeRole(admin, organization)

        await createTestOrganizationEmployee(admin, organization, employeeUser.user, role)

        const [testProperty] = await createTestProperty(admin, organization)
        property = testProperty

        notEmployeeUser = await makeClientWithNewRegisteredAndLoggedInUser()
        const [secondTestOrganization] = await createTestOrganization(admin)
        const [secondRole] = await createTestOrganizationEmployeeRole(admin, secondTestOrganization)
        await createTestOrganizationEmployee(admin, secondTestOrganization, notEmployeeUser.user, secondRole)
    })
    beforeEach(async () => {
        const [testIncident] = await createTestIncident(admin, organization, INCIDENT_PAYLOAD)
        incidentByAdmin = testIncident

        const [testIncidentProperty] = await createTestIncidentProperty(admin, incidentByAdmin, property)
        incidentPropertyByAdmin = testIncidentProperty
    })
    describe('Accesses', () => {
        describe('Admin', () => {
            test('can create', async () => {
                expect(incidentPropertyByAdmin).toBeDefined()
                expect(incidentPropertyByAdmin).toHaveProperty('property.id', property.id)
                expect(incidentPropertyByAdmin).toHaveProperty('incident.id', incidentByAdmin.id)
            })
            test('can read', async () => {
                const incidentProperty = await IncidentProperty.getOne(admin, { id: incidentPropertyByAdmin.id }, { sortBy: ['updatedAt_DESC'] })
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
            })
            test('can\'t update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestIncidentProperty(admin, incidentPropertyByAdmin.id, {})
                })
            })
            test('can soft delete', async () => {
                const [incidentProperty] = await updateTestIncidentProperty(admin, incidentPropertyByAdmin.id, DELETED_PAYLOAD)
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
                expect(incidentProperty).toHaveProperty('deletedAt')
                expect(incidentProperty.deletedAt).not.toBeNull()
            })
            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await IncidentProperty.delete(admin, incidentPropertyByAdmin.id)
                })
            })
        })

        describe('Support', () => {
            test('can create', async () => {
                const [incident] = await createTestIncident(admin, organization, INCIDENT_PAYLOAD)
                const [incidentProperty] = await createTestIncidentProperty(support, incident, property)
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('property.id', property.id)
                expect(incidentProperty).toHaveProperty('incident.id', incident.id)
            })
            test('can read', async () => {
                const incidentProperty = await IncidentProperty.getOne(support, { id: incidentPropertyByAdmin.id }, { sortBy: ['updatedAt_DESC'] })
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
            })
            test('can\'t update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestIncidentProperty(support, incidentPropertyByAdmin.id, {})
                })
            })
            test('can soft delete', async () => {
                const [incidentProperty] = await updateTestIncidentProperty(support, incidentPropertyByAdmin.id, DELETED_PAYLOAD)
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
                expect(incidentProperty).toHaveProperty('deletedAt')
                expect(incidentProperty.deletedAt).not.toBeNull()
            })
            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await IncidentProperty.delete(support, incidentPropertyByAdmin.id)
                })
            })
        })

        describe('Employee', () => {
            test('can create', async () => {
                const [incident] = await createTestIncident(admin, organization, INCIDENT_PAYLOAD)
                const [incidentProperty] = await createTestIncidentProperty(employeeUser, incident, property)
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('property.id', property.id)
                expect(incidentProperty).toHaveProperty('incident.id', incident.id)
                expect(incidentProperty).toHaveProperty('propertyAddress', property.address)
                expect(incidentProperty).toHaveProperty('propertyAddressMeta', property.addressMeta)
            })
            test('can read', async () => {
                const incidentProperty = await IncidentProperty.getOne(employeeUser, { id: incidentPropertyByAdmin.id }, { sortBy: ['updatedAt_DESC'] })
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
            })
            test('can\'t update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestIncidentProperty(employeeUser, incidentPropertyByAdmin.id, {})
                })
            })
            test('can soft delete', async () => {
                const [incidentProperty] = await updateTestIncidentProperty(employeeUser, incidentPropertyByAdmin.id, DELETED_PAYLOAD)
                expect(incidentProperty).toBeDefined()
                expect(incidentProperty).toHaveProperty('id', incidentPropertyByAdmin.id)
                expect(incidentProperty).toHaveProperty('deletedAt')
                expect(incidentProperty.deletedAt).not.toBeNull()
            })
            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await IncidentProperty.delete(employeeUser, incidentPropertyByAdmin.id)
                })
            })
        })

        describe('Not employee', () => {
            test('can\'t create', async () => {
                const [incident] = await createTestIncident(admin, organization, INCIDENT_PAYLOAD)
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestIncidentProperty(notEmployeeUser, incident, property)
                })
            })
            test('can\'t read', async () => {
                const incidents = await IncidentProperty.getAll(notEmployeeUser, { id: incidentPropertyByAdmin.id }, { sortBy: ['updatedAt_DESC'], first: 10 })
                expect(incidents).toHaveLength(0)
            })
            test('can\'t update', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestIncidentProperty(notEmployeeUser, incidentPropertyByAdmin.id, DELETED_PAYLOAD)
                })
            })
            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await IncidentProperty.delete(notEmployeeUser, incidentPropertyByAdmin.id)
                })
            })
        })

        describe('Anonymous', () => {
            test('can\'t create', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestIncidentProperty(anonymous, incidentByAdmin, property)
                })
            })
            test('can\'t read', async () => {
                await expectToThrowAuthenticationErrorToObjects(async () => {
                    await IncidentProperty.getOne(anonymous, { id: incidentPropertyByAdmin.id }, { sortBy: ['updatedAt_DESC'] })
                })
            })
            test('can\'t update', async () => {
                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestIncidentProperty(anonymous, incidentPropertyByAdmin.id, {})
                })
            })
            test('can\'t delete', async () => {
                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await IncidentProperty.delete(anonymous, incidentPropertyByAdmin.id)
                })
            })
        })
    })

    describe('Validations', () => {
        test('Constraint: unique incident + property', async () => {
            await catchErrorFrom(async () => {
                await createTestIncidentProperty(admin, incidentByAdmin, property)
            }, ({ errors }) => {
                expect(errors).toHaveLength(1)
                expect(errors[0]).toEqual(expect.objectContaining({
                    message: expect.stringContaining('unique constraint'),
                }))
            })
        })
        test('Incident and property should not belong to different organizations', async () => {
            const [organization] = await createTestOrganization(admin)
            const [property] = await createTestProperty(admin, organization)
            await catchErrorFrom(async () => {
                await createTestIncidentProperty(admin, incidentByAdmin, property)
            }, ({ errors }) => {
                expect(errors).toHaveLength(1)
                expect(errors[0]).toEqual(expect.objectContaining({
                    message: INCIDENT_PROPERTY_ERRORS.DIFFERENT_ORGANIZATIONS.message,
                }))
            })
        })
    })
})
