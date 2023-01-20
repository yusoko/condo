/**
 * Generated by `createschema address.AddressSource 'source:Text;'`
 */

import {
    AddressSource,
    AddressSourceCreateInput,
    AddressSourceUpdateInput,
    QueryAllAddressSourcesArgs,
} from '@app/address-service/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { AddressSource as AddressSourceGQL } from '@address-service/domains/address/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<AddressSource, AddressSourceCreateInput, AddressSourceUpdateInput, QueryAllAddressSourcesArgs>(AddressSourceGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
