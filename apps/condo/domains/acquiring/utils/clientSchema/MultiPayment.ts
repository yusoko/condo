/**
 * Generated by `createschema acquiring.MultiPayment 'amount:Decimal; commission?:Decimal; time:DateTimeUtc; cardNumber:Text; serviceCategory:Text;'`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { MultiPayment as MultiPaymentGQL } from '@condo/domains/acquiring/gql'
import { MultiPayment, MultiPaymentUpdateInput, QueryAllMultiPaymentsArgs } from '../../../../schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'amount', 'explicitFee', 'explicitServiceCharge', 'serviceFee', 'implicitFee', 'amountWithoutExplicitFee', 'currencyCode', 'withdrawnAt', 'cardNumber', 'serviceCategory', 'paymentWay', 'payerEmail', 'transactionId', 'meta', 'status']
const RELATIONS = ['user', 'integration', 'payments']

export interface IMultiPaymentUIState extends MultiPayment {
    id: string
}

function convertToUIState (item: MultiPayment): IMultiPaymentUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as IMultiPaymentUIState
}

export interface IMultiPaymentFormState {
    id?: undefined
}

function convertToUIFormState (state: IMultiPaymentUIState): IMultiPaymentFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as IMultiPaymentFormState
}

function convertToGQLInput (state: IMultiPaymentFormState): MultiPaymentUpdateInput {
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
} = generateReactHooks<MultiPayment, MultiPaymentUpdateInput, IMultiPaymentFormState, IMultiPaymentUIState, QueryAllMultiPaymentsArgs>(MultiPaymentGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
