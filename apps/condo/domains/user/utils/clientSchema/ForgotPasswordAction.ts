/**
 * Generated by `createschema user.ForgotPasswordAction 'user:Relationship:User:CASCADE; token:Text; requestedAt:DateTimeUtc; expiresAt:DateTimeUtc; usedAt:DateTimeUtc;'`
 */

import {
    ForgotPasswordAction,
    ForgotPasswordActionCreateInput,
    ForgotPasswordActionUpdateInput,
    QueryAllForgotPasswordActionsArgs,
} from '@app/condo/schema'
import { generateNewReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { ForgotPasswordAction as ForgotPasswordActionGQL } from '@condo/domains/user/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateNewReactHooks<ForgotPasswordAction, ForgotPasswordActionCreateInput, ForgotPasswordActionUpdateInput, QueryAllForgotPasswordActionsArgs>(ForgotPasswordActionGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
