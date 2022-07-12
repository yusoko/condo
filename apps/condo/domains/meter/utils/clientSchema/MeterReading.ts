/**
 * Generated by `createschema meter.MeterReading 'number:Integer; date:DateTimeUtc; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; meter:Relationship:Meter:CASCADE; property:Relationship:Property:CASCADE; organization:Relationship:Organization:CASCADE; value:Integer; sectionName?:Text; floorName?:Text; unitName?:Text; client?:Relationship:User:SET_NULL; clientName?:Text; clientEmail?:Text; clientPhone?:Text; contact?:Relationship:Contact:SET_NULL; source:Relationship:MeterSource:PROTECT'`
 */

import {
    MeterReading,
    MeterReadingCreateInput,
    MeterReadingUpdateInput,
    QueryAllMeterReadingsArgs,
} from '@app/condo/schema'
import { generateNewReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { MeterReading as MeterReadingGQL } from '@condo/domains/meter/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateNewReactHooks<MeterReading, MeterReadingCreateInput, MeterReadingUpdateInput, QueryAllMeterReadingsArgs>(MeterReadingGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
