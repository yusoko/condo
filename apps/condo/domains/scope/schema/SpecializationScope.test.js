/**
 * Generated by `createschema scope.SpecializationScope 'employee:Relationship:OrganizationEmployee:CASCADE; specialization:Relationship:TicketCategoryClassifier:CASCADE;'`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE } = require('@condo/keystone/test.utils')

const {
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAccessDeniedErrorToObj,
} = require('@condo/domains/common/utils/testSchema')

const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const { createTestOrganization, createTestOrganizationEmployeeRole, createTestOrganizationEmployee } = require('@condo/domains/organization/utils/testSchema')
const { createTestSpecializationScope, updateTestSpecializationScope } = require('@condo/domains/scope/utils/testSchema')
const { createTestTicketCategoryClassifier } = require('@condo/domains/ticket/utils/testSchema')

describe('SpecializationScope', () => {
    describe('accesses', () => {
        describe('admin', () => {
            describe('can create SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)
                const [specializationScope] = await createTestSpecializationScope(admin, employee, specialization)

                expect(specializationScope.id).toMatch(UUID_RE)
            })

            describe('can update SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)
                const [specializationScope] = await createTestSpecializationScope(admin, employee, specialization)

                const [updatedPropertyScope] = await updateTestSpecializationScope(admin, specializationScope.id, {})

                expect(updatedPropertyScope.id).toEqual(specializationScope.id)
            })
        })

        describe('employee', async () => {
            it('employee with canManageEmployees ability: can create SpecializationScope with employee and specialization from his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(user, employee, specialization)

                expect(specializationScope.id).toMatch(UUID_RE)
            })

            it('employee with canManageEmployees ability: cannot create SpecializationScope with employee from in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()
                const user1 = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [organization1] = await createTestOrganization(admin)
                const [role1] = await createTestOrganizationEmployeeRole(admin, organization1)
                const [employee1] = await createTestOrganizationEmployee(admin, organization1, user1.user, role1)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestSpecializationScope(user, employee1, specialization)
                })
            })

            it('employee without canManageEmployees ability: cannot create SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestSpecializationScope(user, employee, specialization)
                })
            })

            it('employee with canManageEmployees ability: can soft delete SpecializationScope in his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(user, employee, specialization)

                const [updatedSpecializationScope] = await updateTestSpecializationScope(user, specializationScope.id, {
                    deletedAt: 'true',
                })

                expect(updatedSpecializationScope.id).toEqual(specializationScope.id)
                expect(updatedSpecializationScope.deletedAt).toBeDefined()
            })

            it('employee with canManageEmployees ability: cannot soft delete SpecializationScope in not his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()
                const user1 = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                await createTestOrganizationEmployee(admin, organization, user.user, role)

                const [organization1] = await createTestOrganization(admin)
                const [role1] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee1] = await createTestOrganizationEmployee(admin, organization1, user1.user, role1)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(admin, employee1, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestSpecializationScope(user, specializationScope.id, {
                        deletedAt: 'true',
                    })
                })
            })

            it('employee with canManageEmployees ability: cannot update SpecializationScope in his organization if its not soft delete operation', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(user, employee, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestSpecializationScope(user, specializationScope.id)
                })
            })

            it('employee without canManageEmployees ability: cannot update SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(admin, employee, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestSpecializationScope(user, specializationScope.id, {
                        deletedAt: 'true',
                    })
                })
            })
        })

        describe('anonymous', async () => {
            it('cannot create SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, admin.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(admin, employee, specialization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestSpecializationScope(anonymous, employee, specializationScope)
                })
            })

            it('cannot update SpecializationScope', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, admin.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [specializationScope] = await createTestSpecializationScope(admin, employee, specialization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestSpecializationScope(anonymous, specializationScope.id)
                })
            })
        })
    })
})
