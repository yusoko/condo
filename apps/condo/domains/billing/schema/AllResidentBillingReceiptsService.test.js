/**
 * Generated by `createservice billing.BillingReceiptsService --type queries`
 */
const { catchErrorFrom } = require('@condo/domains/common/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { addResidentAccess, makeClientWithResidentUser } = require('@condo/domains/user/utils/testSchema')
const { createTestBillingIntegration, createTestBillingReceipt, updateTestBillingReceipt, ResidentBillingReceipt } = require('../utils/testSchema')
const { registerServiceConsumerByTestClient, createTestResident, ServiceConsumer } = require('@condo/domains/resident/utils/testSchema')
const { makeClientWithProperty, createTestProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestBillingAccount, createTestBillingProperty, createTestBillingIntegrationOrganizationContext } = require('@condo/domains/billing/utils/testSchema')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')

describe('AllResidentBillingReceipts', () => {

    test('user with valid serviceAccount can read BillingReceipt without raw data', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)
        const [billingAccount2] = await createTestBillingAccount(adminClient, context, billingProperty)

        await addResidentAccess(userClient.user)

        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })
        const payload = {
            residentId: resident.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        }

        await registerServiceConsumerByTestClient(userClient, payload)
        const [receipt] = await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount2)

        const objs = await ResidentBillingReceipt.getAll(userClient)
        expect(objs).toHaveLength(1)
        expect(objs[0].raw).toEqual(undefined)
        expect(objs[0].id).toEqual(receipt.id)
    })

    test('user with valid serviceAccount can read BillingReceipt without raw data even if there are other Resident with this service consumer', async () => {
        /**
         * Story: Husband and Wife live in the same flat,
         *        They have the same accountNumber and unitName, but different Residents and serviceConsumers
         *        Both Wife and Husband should be able to read BillingReceipts
         */

        const adminClient = await makeLoggedInAdminClient()
        const [organization] = await createTestOrganization(adminClient)
        const [property] = await createTestProperty(adminClient, organization)

        const husbandClient = await makeClientWithResidentUser()
        const wifeClient = await makeClientWithResidentUser()

        // Create billing integration and billing entities
        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)
        const [billingAccount2] = await createTestBillingAccount(adminClient, context, billingProperty)
        const [receipt] = await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount2)

        const [residentHusband] = await createTestResident(adminClient, husbandClient.user, organization, property, {
            unitName: billingAccountAttrs.unitName,
        })
        const [serviceConsumerHusband] = await registerServiceConsumerByTestClient(husbandClient, {
            residentId: residentHusband.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        })
        // you can't read billingAccount field as resident, so we should get true serviceConsumer here to further check
        const [serviceConsumerHusbandWithAccount] = await ServiceConsumer.getAll(adminClient, { id: serviceConsumerHusband.id })

        const [residentWife] = await createTestResident(adminClient, wifeClient.user, organization, property, {
            unitName: billingAccountAttrs.unitName,
        })
        const [serviceConsumerWife] = await registerServiceConsumerByTestClient(wifeClient, {
            residentId: residentWife.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        })
        // you can't read billingAccount field as resident, so we should get true serviceConsumer here to further check
        const [serviceConsumerWifeWithAccount] = await ServiceConsumer.getAll(adminClient, { id: serviceConsumerWife.id })

        expect(serviceConsumerHusbandWithAccount.billingAccount.id).toEqual(serviceConsumerWifeWithAccount.billingAccount.id)
        expect(serviceConsumerHusbandWithAccount.billingAccount.id).toEqual(billingAccount.id)

        const objsHusband = await ResidentBillingReceipt.getAll(husbandClient)
        expect(objsHusband).toHaveLength(1)
        expect(objsHusband[0].raw).toEqual(undefined)
        expect(objsHusband[0].id).toEqual(receipt.id)

        const objsWife = await ResidentBillingReceipt.getAll(wifeClient)
        expect(objsWife).toHaveLength(1)
        expect(objsWife[0].raw).toEqual(undefined)
        expect(objsWife[0].id).toEqual(receipt.id)
    })

    test('user with valid serviceAccount can filter residentBillingReceipts by serviceConsumer', async () => {
        // User has flats in building A and building B
        // Each building has own BillingOrganizationIntegrationContext
        // User is able to get receipts for both of his buildings

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        // User has two flats in building A:
        const [integrationA] = await createTestBillingIntegration(adminClient)
        const [contextA] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integrationA)
        const [billingPropertyA] = await createTestBillingProperty(adminClient, contextA)
        const [billingAccountA, billingAccountAttrsA] = await createTestBillingAccount(adminClient, contextA, billingPropertyA)
        const [billingAccountA2, billingAccountAttrsA2] = await createTestBillingAccount(adminClient, contextA, billingPropertyA)

        await addResidentAccess(userClient.user)
        const [residentA] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrsA.unitName,
        })

        const serviceConsumerPayloadA = {
            residentId: residentA.id,
            unitName: billingAccountAttrsA.unitName,
            accountNumber: billingAccountAttrsA.number,
        }
        const [serviceConsumerA] = await registerServiceConsumerByTestClient(userClient, serviceConsumerPayloadA)

        const serviceConsumerPayloadA2 = {
            residentId: residentA.id,
            unitName: billingAccountAttrsA2.unitName,
            accountNumber: billingAccountAttrsA2.number,
        }
        const [serviceConsumerA2] = await registerServiceConsumerByTestClient(userClient, serviceConsumerPayloadA2)

        await createTestBillingReceipt(adminClient, contextA, billingPropertyA, billingAccountA)
        await createTestBillingReceipt(adminClient, contextA, billingPropertyA, billingAccountA2)

        // User has one flat in building B:
        const [organizationB] = await createTestOrganization(adminClient)
        const [propertyB] = await createTestProperty(adminClient, organizationB)
        const [integrationB] = await createTestBillingIntegration(adminClient)
        const [contextB] = await createTestBillingIntegrationOrganizationContext(adminClient, organizationB, integrationB)
        const [billingPropertyB] = await createTestBillingProperty(adminClient, contextB)
        const [billingAccountB, billingAccountAttrsB] = await createTestBillingAccount(adminClient, contextB, billingPropertyB)

        const [residentB] = await createTestResident(adminClient, userClient.user, organizationB, propertyB, {
            unitName: billingAccountAttrsB.unitName,
        })

        const payloadForServiceConsumerB = {
            residentId: residentB.id,
            unitName: billingAccountAttrsB.unitName,
            accountNumber: billingAccountAttrsB.number,
        }
        const [serviceConsumerB] = await registerServiceConsumerByTestClient(userClient, payloadForServiceConsumerB)

        const [receipt] = await createTestBillingReceipt(adminClient, contextB, billingPropertyB, billingAccountB)

        // User get two receipts for his building A
        const objs = await ResidentBillingReceipt.getAll(userClient, { serviceConsumer: { resident: { id: residentA.id } } })
        expect(objs).toHaveLength(2)

        // User get one receipt for his building B
        const objsForResident2 = await ResidentBillingReceipt.getAll(userClient, { serviceConsumer: { resident: { id: residentB.id } } })
        expect(objsForResident2).toHaveLength(1)
    })

    test('user with valid multiple serviceAccounts can read all his BillingReceipts without raw data', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)
        const [billingAccount2, billingAccountAttrs2] = await createTestBillingAccount(adminClient, context, billingProperty)

        await addResidentAccess(userClient.user)

        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        }
        await registerServiceConsumerByTestClient(userClient, payload)

        const payload2 = {
            residentId: resident.id,
            unitName: billingAccountAttrs2.unitName,
            accountNumber: billingAccountAttrs2.number,
        }
        await registerServiceConsumerByTestClient(userClient, payload2)

        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount2)

        const objs = await ResidentBillingReceipt.getAll(userClient)
        expect(objs).toHaveLength(2)
    })

    test('user with valid serviceAccount can read BillingReceipt without raw data with where query', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await addResidentAccess(userClient.user)

        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })
        const payload = {
            residentId: resident.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        }

        await registerServiceConsumerByTestClient(userClient, payload)
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        const [receipt] = await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)

        await updateTestBillingReceipt(adminClient, receipt.id, { toPay: '100.50' })

        const objs = await ResidentBillingReceipt.getAll(userClient, { toPay: '100.50' })
        expect(objs).toHaveLength(1)
        expect(objs[0].raw).toEqual(undefined)
        expect(objs[0].id).toEqual(receipt.id)
    })

    test('user with stolen billing account id and hacky intentions cant read BillingReceipt', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)

        await addResidentAccess(userClient.user)
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })
        const payload = {
            residentId: resident.id,
            unitName: billingAccountAttrs.unitName,
            accountNumber: billingAccountAttrs.number,
        }
        await registerServiceConsumerByTestClient(userClient, payload)

        const hackerClient = await makeClientWithProperty()
        const [context2] = await createTestBillingIntegrationOrganizationContext(adminClient, hackerClient.organization, integration)
        const [billingProperty2] = await createTestBillingProperty(adminClient, context2)
        const [_, billingAccountAttrs2] = await createTestBillingAccount(adminClient, context2, billingProperty2)

        await addResidentAccess(hackerClient.user)
        const [hackerResident] = await createTestResident(adminClient, hackerClient.user, hackerClient.organization, hackerClient.property, {
            unitName: billingAccountAttrs2.unitName,
        })
        const hackerPayload = {
            residentId: hackerResident.id,
            unitName: billingAccountAttrs2.unitName,
            accountNumber: billingAccountAttrs2.number,
        }
        await registerServiceConsumerByTestClient(hackerClient, hackerPayload)

        // Hacker is connected to billingAccount2 and tries to get receipts for billingAccount
        await catchErrorFrom(async () => {
            await ResidentBillingReceipt.getAll(hackerClient, { account: { id: billingAccountAttrs.id } })
        }, (err) => {
            expect(err).toBeDefined()
        })
    })

    test('user without valid serviceAccount cant read BillingReceipt', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })
        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        await addResidentAccess(userClient.user)

        await catchErrorFrom(async () => {
            await ResidentBillingReceipt.getAll(userClient, { toPay: '100.50' })
        }, (err) => {
            expect(err).toBeDefined()
        } )
    })

    test('user without valid resident cant read BillingReceipt', async () => {
        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccount, billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await createTestBillingReceipt(adminClient, context, billingProperty, billingAccount)
        await addResidentAccess(userClient.user)

        await catchErrorFrom(async () => {
            await ResidentBillingReceipt.getAll(userClient, { toPay: '100.50' })
        }, (err) => {
            expect(err).toBeDefined()
        } )
    })
})