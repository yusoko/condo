/**
 * Generated by `createschema banking.BankIntegrationOrganizationContext 'integration:Relationship:BankIntegration:CASCADE; organization:Relationship:Organization:CASCADE;'`
 */

import {
    BankIntegrationOrganizationContext,
    BankIntegrationOrganizationContextCreateInput,
    BankIntegrationOrganizationContextUpdateInput,
    QueryAllBankIntegrationOrganizationContextsArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { BankIntegrationOrganizationContext as BankIntegrationOrganizationContextGQL } from '@condo/domains/banking/gql'

// TODO(codegen): write utils like convertToFormState and formValuesProcessor if needed, otherwise delete this TODO

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<BankIntegrationOrganizationContext, BankIntegrationOrganizationContextCreateInput, BankIntegrationOrganizationContextUpdateInput, QueryAllBankIntegrationOrganizationContextsArgs>(BankIntegrationOrganizationContextGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}