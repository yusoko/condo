/**
 * Generated by `createschema notification.MessageOrganizationBlackList 'organization?:Relationship:Organization:CASCADE; description:Text'`
 */

import {
    MessageOrganizationBlackList,
    MessageOrganizationBlackListCreateInput,
    MessageOrganizationBlackListUpdateInput,
    QueryAllMessageOrganizationBlackListsArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { MessageOrganizationBlackList as MessageOrganizationBlackListGQL } from '@condo/domains/notification/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<MessageOrganizationBlackList, MessageOrganizationBlackListCreateInput, MessageOrganizationBlackListUpdateInput, QueryAllMessageOrganizationBlackListsArgs>(MessageOrganizationBlackListGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
