/**
 * Generated by `createschema resident.Resident 'user:Relationship:User:CASCADE; organization:Relationship:Organization:PROTECT; property:Relationship:Property:PROTECT; billingAccount?:Relationship:BillingAccount:SET_NULL; unitName:Text;'`
 */

const faker = require('faker')
const { registerNewOrganization } = require('@condo/domains/organization/utils/testSchema/Organization')
const { makeClientWithResidentUser, addResidentAccess } = require('@condo/domains/user/utils/testSchema')
const { createTestProperty, makeClientWithResidentUserAndProperty } = require('@condo/domains/property/utils/testSchema')
const { buildingMapJson } = require('@condo/domains/property/constants/property')
const { createTestBillingAccount } = require('@condo/domains/billing/utils/testSchema')
const { createTestBillingProperty } = require('@condo/domains/billing/utils/testSchema')
const { makeContextWithOrganizationAndIntegrationAsAdmin } = require('@condo/domains/billing/utils/testSchema')
const { createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganizationEmployeeRole } = require('@condo/domains/organization/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE } = require('@core/keystone/test.utils')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')

const { Resident, createTestResident, updateTestResident } = require('@condo/domains/resident/utils/testSchema')
const { catchErrorFrom, expectToThrowAccessDeniedErrorToObj, expectToThrowAccessDeniedErrorToObjects } = require('../../common/utils/testSchema')
const { softDeleteTestResident } = require('../utils/testSchema')
const { buildFakeAddressMeta } = require('@condo/domains/common/utils/testSchema/factories')

describe('Resident', () => {

    describe('validations', async () => {
        it('throws error on create record with same set of fields: "property", "unitName" for current user', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const duplicatedFields = {
                property: { connect: { id: userClient.property.id } },
                unitName: faker.random.alphaNumeric(3),
            }
            await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, duplicatedFields)

            await catchErrorFrom(async () => {
                await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, duplicatedFields)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Cannot create resident, because another resident with the same provided "property", "unitName" fields already exists for current user')
                expect(data).toEqual({ 'obj': null })
            })
        })

        it('allows to create record with same set of fields: "property", "unitName" for different user', async () => {
            const userClient = await makeClientWithProperty()
            const userClient2 = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const duplicatedFields = {
                property: { connect: { id: userClient.property.id } },
                unitName: faker.random.alphaNumeric(3),
            }
            await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, duplicatedFields)
            const [obj] = await createTestResident(adminClient, userClient2.user, userClient.organization, userClient.property, duplicatedFields)
            expect(obj.id).toMatch(UUID_RE)
        })

        it('throws error, when trying to connect new resident to billing account, that is connected to another resident', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [billingProperty] = await createTestBillingProperty(adminClient, context)
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)

            const billingAccountConnection = {
                billingAccount: { connect: { id: billingAccount.id } },
            }

            await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, billingAccountConnection)

            await catchErrorFrom(async () => {
                await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, billingAccountConnection)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Specified billing account is already connected to another resident')
                expect(data).toEqual({ 'obj': null })
            })
        })

        it('throws error, when trying to connect new resident to property with another address', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [billingProperty] = await createTestBillingProperty(adminClient, context)
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)

            const [propertyWithAnotherAddress] = await createTestProperty(userClient, userClient.organization, { map: buildingMapJson })

            const attrs = {
                billingAccount: { connect: { id: billingAccount.id } },
                address: userClient.property.address,
            }

            await catchErrorFrom(async () => {
                await createTestResident(adminClient, userClient.user, userClient.organization, propertyWithAnotherAddress, attrs)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Cannot connect property, because its address differs from address of resident')
                expect(data).toEqual({ 'obj': null })
            })
        })
    })

    describe('Virtual fields', () => {
        describe('residentOrganization', () => {
            it('returns id and name of related organization', async () => {
                const userClient = await makeClientWithProperty()
                const adminClient = await makeLoggedInAdminClient()

                const [{ id }] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
                await addResidentAccess(userClient.user)
                const [obj] = await Resident.getAll(userClient, { id })
                expect(obj.residentOrganization).toBeDefined()
                expect(obj.residentOrganization.id).toEqual(userClient.organization.id)
                expect(obj.residentOrganization.name).toEqual(userClient.organization.name)
                expect(Object.keys(obj.residentOrganization).length).toEqual(2)
            })

            it('returns null if no related organization', async () => {
                const userClient = await makeClientWithProperty()
                const adminClient = await makeLoggedInAdminClient()

                const [{ id }] = await createTestResident(adminClient, userClient.user, null, userClient.property)
                await addResidentAccess(userClient.user)
                const [obj] = await Resident.getAll(userClient, { id })
                expect(obj.residentOrganization).toBeNull()
            })
        })

        describe('residentProperty', () => {
            it('returns id, name and address of related property', async () => {
                const userClient = await makeClientWithProperty()
                const adminClient = await makeLoggedInAdminClient()

                const [{ id }] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
                await addResidentAccess(userClient.user)
                const [obj] = await Resident.getAll(userClient, { id })
                expect(obj.residentProperty).toBeDefined()
                expect(obj.residentProperty.id).toEqual(userClient.property.id)
                expect(obj.residentProperty.name).toEqual(userClient.property.name)
                expect(obj.residentProperty.address).toEqual(userClient.property.address)
                expect(Object.keys(obj.residentProperty).length).toEqual(3)
            })

            it('returns null if no related property', async () => {
                const userClient = await makeClientWithProperty()
                const adminClient = await makeLoggedInAdminClient()

                const address = faker.lorem.words()
                const attrs = {
                    address,
                    addressMeta: buildFakeAddressMeta(address),
                }
                console.log('user and admin clients created')

                const [{ id }] = await createTestResident(adminClient, userClient.user, userClient.organization, null, attrs)
                await addResidentAccess(userClient.user)
                const [obj] = await Resident.getAll(userClient, { id })
                expect(obj.residentProperty).toBeNull()
            })
        })
    })

    describe('Create', () => {
        it('can be created by admin', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()

            const { context } = await makeContextWithOrganizationAndIntegrationAsAdmin()
            const [billingProperty] = await createTestBillingProperty(adminClient, context)
            const [billingAccount] = await createTestBillingAccount(adminClient, context, billingProperty)

            const fields = {
                billingAccount: { connect: { id: billingAccount.id } },
            }

            const [obj, attrs] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, fields)
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
            expect(obj.user.id).toEqual(userClient.user.id)
            expect(obj.organization.id).toEqual(userClient.organization.id)
            expect(obj.property.id).toEqual(userClient.property.id)
            expect(obj.billingAccount.id).toEqual(billingAccount.id)
        })

        it('can be created by user with type "resident"', async () => {
            const userClient = await makeClientWithResidentUser()
            const [organization] = await registerNewOrganization(userClient)
            const [property] = await createTestProperty(userClient, organization, { map: buildingMapJson })

            const [obj, attrs] = await createTestResident(userClient, userClient.user, organization, property)

            expect(obj.id).toMatch(UUID_RE)
            expect(obj.dv).toEqual(1)
            expect(obj.sender).toEqual(attrs.sender)
            expect(obj.unitName).toMatch(attrs.unitName)
            expect(obj.v).toEqual(1)
            expect(obj.newId).toEqual(null)
            expect(obj.deletedAt).toEqual(null)
            expect(obj.createdBy).toEqual(expect.objectContaining({ id: userClient.user.id }))
            expect(obj.updatedBy).toEqual(expect.objectContaining({ id: userClient.user.id }))
            expect(obj.createdAt).toMatch(DATETIME_RE)
            expect(obj.updatedAt).toMatch(DATETIME_RE)
            expect(obj.user.id).toEqual(userClient.user.id)
            expect(obj.organization.id).toMatch(organization.id)
        })

        it('cannot be created by other users', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const [organization] = await createTestOrganization(adminClient)
            const [anotherOrganization] = await createTestOrganization(adminClient)
            const [role] = await createTestOrganizationEmployeeRole(adminClient, organization)
            await createTestOrganizationEmployee(adminClient, organization, userClient.user, role)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestResident(userClient, userClient.user, anotherOrganization, userClient.property)
            })
        })

        it('cannot be created by user, who is not employed in specified organization', async () => {
            const userClient = await makeClientWithProperty()
            const anotherUser = await makeClientWithProperty()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestResident(anotherUser, userClient.user, userClient.organization, userClient.property)
            })
        })

        it('cannot be created by anonymous', async () => {
            const userClient = await makeClientWithProperty()
            const anonymous = await makeClient()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestResident(anonymous, userClient.user, userClient.organization, userClient.property)
            })
        })
    })

    describe('Read', () => {
        it('can be read by admin', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
            const objs = await Resident.getAll(adminClient, {}, { sortBy: ['updatedAt_DESC'] })
            expect(objs.length >= 1).toBeTruthy()
            expect(objs[0].id).toMatch(obj.id)
        })

        it('cannot be read by user, who is employed in organization, which manages associated property', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
            await expectToThrowAccessDeniedErrorToObjects(async () => {
                await Resident.getAll(userClient, {}, { sortBy: ['updatedAt_DESC'] })
            })
        })

        it('user with type "resident" can read only own residents', async () => {
            const userClient = await makeClientWithProperty()
            await addResidentAccess(userClient.user)
            const anotherUserClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
            await createTestResident(adminClient, anotherUserClient.user, anotherUserClient.organization, userClient.property)
            const objs = await Resident.getAll(userClient, {}, { sortBy: ['updatedAt_DESC'] })
            expect(objs).toHaveLength(1)
            expect(objs[0].id).toMatch(obj.id)
        })

        it('cannot be read by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const anonymousClient = await makeClient()
            await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)
            await expectToThrowAccessDeniedErrorToObjects(async () => {
                await Resident.getAll(anonymousClient)
            })
        })
    })

    describe('Update', () => {
        it('cannot be updated by changing address, addressMeta, property or unitName', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            await catchErrorFrom(async () => {
                const payload = {
                    unitName: faker.random.alphaNumeric(3),
                }
                await updateTestResident(adminClient, obj.id, payload)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Changing of address, addressMeta, unitName or property is not allowed for already existing Resident')
                expect(data).toEqual({ 'obj': null })
            })

            await catchErrorFrom(async () => {
                const payload = {
                    address: faker.lorem.words(),
                }
                await updateTestResident(adminClient, obj.id, payload)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Changing of address, addressMeta, unitName or property is not allowed for already existing Resident')
                expect(data).toEqual({ 'obj': null })
            })

            await catchErrorFrom(async () => {
                const [property] = await createTestProperty(userClient, userClient.organization, { map: buildingMapJson })
                // `property` should correspond to `address` to not overlap with another test case of `property` validation with will cause error "Cannot connect property, because its address differs from address of resident"
                const payload = {
                    address: property.address,
                    property: { connect: { id: property.id } },
                }
                await updateTestResident(adminClient, obj.id, payload)
            }, ({ errors, data }) => {
                expect(errors[0].message).toMatch('You attempted to perform an invalid mutation')
                expect(errors[0].data.messages[0]).toMatch('Changing of address, addressMeta, unitName or property is not allowed for already existing Resident')
                expect(data).toEqual({ 'obj': null })
            })
        })

        it('cannot be updated by other user with type resident', async () => {
            const userClient = await makeClientWithResidentUserAndProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const otherUserClient = await makeClientWithResidentUserAndProperty()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestResident(otherUserClient, obj.id, {})
            })
        })

        it('can be updated by admin', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const [objUpdated, attrs] = await updateTestResident(adminClient, obj.id)

            expect(objUpdated.id).toEqual(obj.id)
            expect(objUpdated.dv).toEqual(1)
            expect(objUpdated.sender).toEqual(attrs.sender)
            expect(objUpdated.v).toEqual(2)
            expect(objUpdated.newId).toEqual(null)
            expect(objUpdated.deletedAt).toEqual(null)
            expect(objUpdated.createdBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
            expect(objUpdated.updatedBy).toEqual(expect.objectContaining({ id: adminClient.user.id }))
            expect(objUpdated.createdAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
        })

        it('cannot be updated by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const anonymousClient = await makeClient()

            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestResident(anonymousClient, obj.id)
            })
        })
    })

    describe('Delete', () => {
        it('cannot be deleted by admin', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()

            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await Resident.delete(adminClient, obj.id)
            })
        })

        it('cannot be deleted by user', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()

            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await Resident.delete(userClient, obj.id)
            })
        })

        it('cannot be deleted by anonymous', async () => {
            const adminClient = await makeLoggedInAdminClient()
            const userClient = await makeClientWithProperty()
            const anonymousClient = await makeClient()

            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await Resident.delete(anonymousClient, obj.id)
            })
        })

        it('can be soft-deleted using update operation by admin', async () => {
            const userClient = await makeClientWithProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const [objUpdated, attrs] = await softDeleteTestResident(adminClient, obj.id)

            expect(objUpdated.id).toEqual(obj.id)
            expect(objUpdated.dv).toEqual(1)
            expect(objUpdated.sender).toEqual(attrs.sender)
            expect(objUpdated.deletedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
        })

        it('can be soft-deleted using update operation by current user with type resident', async () => {
            const userClient = await makeClientWithResidentUserAndProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const [objUpdated, attrs] = await softDeleteTestResident(userClient, obj.id)

            expect(objUpdated.id).toEqual(obj.id)
            expect(objUpdated.dv).toEqual(1)
            expect(objUpdated.sender).toEqual(attrs.sender)
            expect(objUpdated.deletedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
            expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
        })

        it('cannot be soft-deleted using update operation by other user with type resident', async () => {
            const userClient = await makeClientWithResidentUserAndProperty()
            const adminClient = await makeLoggedInAdminClient()
            const [obj] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property)

            const otherUserClient = await makeClientWithResidentUserAndProperty()

            await expectToThrowAccessDeniedErrorToObj(async () => {
                await softDeleteTestResident(otherUserClient, obj.id)
            })
        })
    })
})
