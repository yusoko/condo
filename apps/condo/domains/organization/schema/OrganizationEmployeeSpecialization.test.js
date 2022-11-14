/**
 * Generated by `createschema organization.OrganizationEmployeeSpecialization 'employee:Relationship:OrganizationEmployee:CASCADE; specialization:Relationship:TicketCategoryClassifier:CASCADE;'`
 */

const {
    makeLoggedInAdminClient,
    makeClient,
    UUID_RE,
    expectToThrowAuthenticationErrorToObj,
    expectToThrowAccessDeniedErrorToObj,
} = require('@open-condo/keystone/test.utils')

const { makeClientWithNewRegisteredAndLoggedInUser } = require('@condo/domains/user/utils/testSchema')

const { createTestOrganization, createTestOrganizationEmployeeRole, createTestOrganizationEmployee, createTestOrganizationEmployeeSpecialization, updateTestOrganizationEmployeeSpecialization } = require('@condo/domains/organization/utils/testSchema')
const { createTestTicketCategoryClassifier } = require('@condo/domains/ticket/utils/testSchema')

describe('OrganizationEmployeeSpecialization', () => {
    describe('accesses', () => {
        describe('admin', () => {
            it('can create OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)
                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee, specialization)

                expect(organizationEmployeeSpecialization.id).toMatch(UUID_RE)
            })

            it('can update OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)
                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee, specialization)

                const [updatedPropertyScope] = await updateTestOrganizationEmployeeSpecialization(admin, organizationEmployeeSpecialization.id, {})

                expect(updatedPropertyScope.id).toEqual(organizationEmployeeSpecialization.id)
            })
        })

        describe('employee', async () => {
            it('employee with canManageEmployees ability: can create OrganizationEmployeeSpecialization with employee and specialization from his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(user, employee, specialization)

                expect(organizationEmployeeSpecialization.id).toMatch(UUID_RE)
            })

            it('employee with canManageEmployees ability: cannot create OrganizationEmployeeSpecialization with employee from in not his organization', async () => {
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
                    await createTestOrganizationEmployeeSpecialization(user, employee1, specialization)
                })
            })

            it('employee without canManageEmployees ability: cannot create OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await createTestOrganizationEmployeeSpecialization(user, employee, specialization)
                })
            })

            it('employee with canManageEmployees ability: can soft delete OrganizationEmployeeSpecialization in his organization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(user, employee, specialization)

                const [updatedOrganizationEmployeeSpecialization] = await updateTestOrganizationEmployeeSpecialization(user, organizationEmployeeSpecialization.id, {
                    deletedAt: 'true',
                })

                expect(updatedOrganizationEmployeeSpecialization.id).toEqual(organizationEmployeeSpecialization.id)
                expect(updatedOrganizationEmployeeSpecialization.deletedAt).toBeDefined()
            })

            it('employee with canManageEmployees ability: cannot soft delete OrganizationEmployeeSpecialization in not his organization', async () => {
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

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee1, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganizationEmployeeSpecialization(user, organizationEmployeeSpecialization.id, {
                        deletedAt: 'true',
                    })
                })
            })

            it('employee with canManageEmployees ability: cannot update OrganizationEmployeeSpecialization in his organization if its not soft delete operation', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization, {
                    canManageEmployees: true,
                })
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(user, employee, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganizationEmployeeSpecialization(user, organizationEmployeeSpecialization.id)
                })
            })

            it('employee without canManageEmployees ability: cannot update OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const user = await makeClientWithNewRegisteredAndLoggedInUser()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, user.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee, specialization)

                await expectToThrowAccessDeniedErrorToObj(async () => {
                    await updateTestOrganizationEmployeeSpecialization(user, organizationEmployeeSpecialization.id, {
                        deletedAt: 'true',
                    })
                })
            })
        })

        describe('anonymous', async () => {
            it('cannot create OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, admin.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee, specialization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await createTestOrganizationEmployeeSpecialization(anonymous, employee, organizationEmployeeSpecialization)
                })
            })

            it('cannot update OrganizationEmployeeSpecialization', async () => {
                const admin = await makeLoggedInAdminClient()
                const anonymous = await makeClient()

                const [organization] = await createTestOrganization(admin)
                const [role] = await createTestOrganizationEmployeeRole(admin, organization)
                const [employee] = await createTestOrganizationEmployee(admin, organization, admin.user, role)
                const [specialization] = await createTestTicketCategoryClassifier(admin)

                const [organizationEmployeeSpecialization] = await createTestOrganizationEmployeeSpecialization(admin, employee, specialization)

                await expectToThrowAuthenticationErrorToObj(async () => {
                    await updateTestOrganizationEmployeeSpecialization(anonymous, organizationEmployeeSpecialization.id)
                })
            })
        })
    })
})
