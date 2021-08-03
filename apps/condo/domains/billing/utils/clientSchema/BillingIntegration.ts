/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { BillingIntegration as BillingIntegrationGQL } from '@condo/domains/billing/gql'
import { BillingIntegration, BillingIntegrationUpdateInput, QueryAllBillingIntegrationsArgs } from '../../../../schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'name', 'detailsTitle', 'detailsText', 'detailsConfirmButtonText', 'detailsInstructionButtonText', 'detailsInstructionButtonLink', 'shortDescription']
const RELATIONS = []

export interface IBillingIntegrationUIState extends BillingIntegration {
    id: string
    // TODO(codegen): write IBillingIntegrationUIState or extends it from
}

function convertToUIState (item: BillingIntegration): IBillingIntegrationUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as IBillingIntegrationUIState
}

export interface IBillingIntegrationFormState {
    id?: undefined
    // TODO(codegen): write IBillingIntegrationUIFormState or extends it from
}

function convertToUIFormState (state: IBillingIntegrationUIState): IBillingIntegrationFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as IBillingIntegrationFormState
}

function convertToGQLInput (state: IBillingIntegrationFormState): BillingIntegrationUpdateInput {
    const sender = getClientSideSenderInfo()
    const result = { dv: 1, sender }
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? { connect: { id: (attrId || state[attr]) } } : state[attr]
    }
    return result
}

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
} = generateReactHooks<BillingIntegration, BillingIntegrationUpdateInput, IBillingIntegrationFormState, IBillingIntegrationUIState, QueryAllBillingIntegrationsArgs>(BillingIntegrationGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
