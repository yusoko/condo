/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 */

import {
    Address,
    AddressCreateInput,
    AddressUpdateInput,
    QueryAllAddressesArgs,
} from '@app/address-service/schema'
import { generateReactHooks } from '@open-condo/codegen/generate.hooks'
import { Address as AddressGQL } from '@address-service/domains/address/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<Address, AddressCreateInput, AddressUpdateInput, QueryAllAddressesArgs>(AddressGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
