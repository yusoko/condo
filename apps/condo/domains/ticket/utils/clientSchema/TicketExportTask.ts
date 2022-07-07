/**
 * Generated by `createschema ticket.TicketExportTask 'status:Select:processing,completed,error; format:Select:excel; exportedRecordsCount:Integer; totalRecordsCount:Integer; file?:File; meta?:Json'`
 */

import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { TicketExportTask as TicketExportTaskGQL } from '@condo/domains/ticket/gql'
import {
    TicketExportTask,
    TicketExportTaskUpdateInput,
    TicketExportTaskCreateInput,
    QueryAllTicketExportTasksArgs,
} from '@app/condo/schema'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<TicketExportTask, TicketExportTaskCreateInput, TicketExportTaskUpdateInput, QueryAllTicketExportTasksArgs>(TicketExportTaskGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
