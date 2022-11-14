/**
 * Generated by `createschema organization.OrganizationEmployeeSpecialization 'employee:Relationship:OrganizationEmployee:CASCADE; specialization:Relationship:TicketCategoryClassifier:CASCADE;'`
 */

import {
    OrganizationEmployeeSpecialization,
    OrganizationEmployeeSpecializationCreateInput,
    OrganizationEmployeeSpecializationUpdateInput,
    QueryAllOrganizationEmployeeSpecializationsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@open-condo/codegen/generate.hooks'
import { OrganizationEmployeeSpecialization as OrganizationEmployeeSpecializationGQL } from '@condo/domains/organization/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
} = generateReactHooks<OrganizationEmployeeSpecialization, OrganizationEmployeeSpecializationCreateInput, OrganizationEmployeeSpecializationUpdateInput, QueryAllOrganizationEmployeeSpecializationsArgs>(OrganizationEmployeeSpecializationGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
    useAllObjects,
}
