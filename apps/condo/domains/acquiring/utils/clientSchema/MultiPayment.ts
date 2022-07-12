/**
 * Generated by `createschema acquiring.MultiPayment 'amount:Decimal; commission?:Decimal; time:DateTimeUtc; cardNumber:Text; serviceCategory:Text;'`
 */
import {
    MultiPayment,
    MultiPaymentCreateInput,
    MultiPaymentUpdateInput,
    QueryAllMultiPaymentsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { MultiPayment as MultiPaymentGQL } from '@condo/domains/acquiring/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<MultiPayment, MultiPaymentCreateInput, MultiPaymentUpdateInput, QueryAllMultiPaymentsArgs>(MultiPaymentGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
