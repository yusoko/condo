/**
 * Generated by `createschema scope.PropertyScopeProperty 'propertyScope:Relationship:PropertyScope:CASCADE; property:Relationship:Property:CASCADE;'`
 */

import {
    PropertyScopeProperty,
    PropertyScopePropertyCreateInput,
    PropertyScopePropertyUpdateInput,
    QueryAllPropertyScopePropertiesArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@open-condo/codegen/generate.hooks'
import { PropertyScopeProperty as PropertyScopePropertyGQL } from '@condo/domains/scope/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
} = generateReactHooks<PropertyScopeProperty, PropertyScopePropertyCreateInput, PropertyScopePropertyUpdateInput, QueryAllPropertyScopePropertiesArgs>(PropertyScopePropertyGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
}
