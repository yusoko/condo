/**
 * Generated by `createschema marketplace.Invoice 'number:Integer; property:Relationship:Property:PROTECT; unitType:Text; unitName:Text; accountNumber:Text; toPay:Decimal; items:Json; contact?:Relationship:Contact:SET_NULL; client?:Relationship:User:SET_NULL; clientName?:Text; clientPhone?:Text; clientEmail?:Text'`
 */

import {
    Invoice,
    InvoiceCreateInput,
    InvoiceUpdateInput,
    QueryAllInvoicesArgs,
} from '@app/condo/schema'

import { generateReactHooks } from '@open-condo/codegen/generate.hooks'

import { Invoice as InvoiceGQL } from '@condo/domains/marketplace/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<Invoice, InvoiceCreateInput, InvoiceUpdateInput, QueryAllInvoicesArgs>(InvoiceGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}