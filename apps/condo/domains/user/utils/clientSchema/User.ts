/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { User as UserGQL } from '@condo/domains/user/gql'
import { User, UserUpdateInput, QueryAllUsersArgs } from '@app/condo/schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'name', 'password', 'isAdmin', 'email', 'isEmailVerified', 'phone', 'isPhoneVerified', 'avatar', 'meta', 'importId']
const RELATIONS = []

export interface IUserUIState extends User {
    id: string
    // TODO(codegen): write IUserUIState or extends it from
}

function convertToUIState (item: User): IUserUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as IUserUIState
}

export interface IUserFormState {
    id?: undefined
    // TODO(codegen): write IUserUIFormState or extends it from
}

function convertToUIFormState (state: IUserUIState): IUserFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as IUserFormState
}

function convertToGQLInput (state: IUserFormState): UserUpdateInput {
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
} = generateReactHooks<User, UserUpdateInput, IUserFormState, IUserUIState, QueryAllUsersArgs>(UserGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
