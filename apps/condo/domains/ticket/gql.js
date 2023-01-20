/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; details:Text; meta?:Json;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const { gql } = require('graphql-tag')

const { generateGqlQueries } = require('@open-condo/codegen/generate.gql')

const { ADDRESS_META_SUBFIELDS_QUERY_LIST } = require('@condo/domains/property/schema/fields/AddressMetaField')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name type } updatedBy { id name } createdAt updatedAt'

const TICKET_CLASSIFIER_ATTRIBUTES_FIELDS = ' classifier { id place { id name } category { id name } problem { id name } }'
const TICKET_PROPERTY_FIELDS = `id name address deletedAt addressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} }`
const TICKET_FIELDS = `{ canReadByResident completedAt lastCommentAt lastResidentCommentAt isResidentTicket reviewValue reviewComment deadline deferredUntil organization { id name country } property { ${TICKET_PROPERTY_FIELDS} } propertyAddress propertyAddressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} } unitType unitName sectionName sectionType floorName status { id name type organization { id } colors { primary secondary additional } } statusReopenedCounter statusUpdatedAt statusReason number client { id name } clientName clientEmail clientPhone contact { id name phone email unitName unitType } assignee { id name } executor { id name } details related { id details } isEmergency isPaid isWarranty meta source { id name type } sourceMeta categoryClassifier { id } placeClassifier { id } problemClassifier { id } ${TICKET_CLASSIFIER_ATTRIBUTES_FIELDS} ${COMMON_FIELDS} }`
const Ticket = generateGqlQueries('Ticket', TICKET_FIELDS)

const TICKET_STATUS_FIELDS = `{ organization { id } type name nameNonLocalized colors { primary secondary additional } ${COMMON_FIELDS} }`
const TicketStatus = generateGqlQueries('TicketStatus', TICKET_STATUS_FIELDS)
const TICKET_SOURCE_FIELDS = `{ organization { id } type name nameNonLocalized ${COMMON_FIELDS} }`
const TicketSource = generateGqlQueries('TicketSource', TICKET_SOURCE_FIELDS)
const SHARE_TICKET_MUTATION = gql`
    mutation shareTicket($data: ShareTicketInput!) {
        obj: shareTicket(data: $data) { status }
    }
`
/*
    We cannot use generated fields from TicketChange here, because we will have circular dependency,
    by requiring something from ./schema modules, that will cause all required items to be undefined.
    So, do it by hands here.
    PS: not exactly by hands, pasted from debugger ;)
*/
const TICKET_CHANGE_DATA_FIELDS = [
    'reviewValueFrom',
    'reviewValueTo',
    'reviewCommentFrom',
    'reviewCommentTo',
    'canReadByResidentFrom',
    'canReadByResidentTo',
    'deadlineFrom',
    'deadlineTo',
    'deferredUntilFrom',
    'deferredUntilTo',
    'statusReopenedCounterFrom',
    'statusReopenedCounterTo',
    'statusReasonFrom',
    'statusReasonTo',
    'numberFrom',
    'numberTo',
    'clientNameFrom',
    'clientNameTo',
    'clientEmailFrom',
    'clientEmailTo',
    'clientPhoneFrom',
    'clientPhoneTo',
    'detailsFrom',
    'detailsTo',
    'isPaidFrom',
    'isPaidTo',
    'isEmergencyFrom',
    'isEmergencyTo',
    'isWarrantyFrom',
    'isWarrantyTo',
    'metaFrom',
    'metaTo',
    'sectionNameFrom',
    'sectionNameTo',
    'sectionTypeFrom',
    'sectionTypeTo',
    'floorNameFrom',
    'floorNameTo',
    'unitNameFrom',
    'unitNameTo',
    'unitTypeFrom',
    'unitTypeTo',
    'sourceMetaFrom',
    'sourceMetaTo',
    'organizationIdFrom',
    'organizationIdTo',
    'organizationDisplayNameFrom',
    'organizationDisplayNameTo',
    'statusIdFrom',
    'statusIdTo',
    'statusDisplayNameFrom',
    'statusDisplayNameTo',
    'clientIdFrom',
    'clientIdTo',
    'clientDisplayNameFrom',
    'clientDisplayNameTo',
    'classifierIdFrom',
    'classifierIdTo',
    'classifierDisplayNameFrom',
    'classifierDisplayNameTo',
    'contactIdFrom',
    'contactIdTo',
    'contactDisplayNameFrom',
    'contactDisplayNameTo',
    'assigneeIdFrom',
    'assigneeIdTo',
    'assigneeDisplayNameFrom',
    'assigneeDisplayNameTo',
    'executorIdFrom',
    'executorIdTo',
    'executorDisplayNameFrom',
    'executorDisplayNameTo',
    'relatedIdFrom',
    'relatedIdTo',
    'relatedDisplayNameFrom',
    'relatedDisplayNameTo',
    'propertyIdFrom',
    'propertyIdTo',
    'propertyDisplayNameFrom',
    'propertyDisplayNameTo',
    'sourceIdFrom',
    'sourceIdTo',
    'sourceDisplayNameFrom',
    'sourceDisplayNameTo',
]
const TICKET_CHANGE_FIELDS = `{ changedByRole ticket { id property { address } organization { id country } } id dv sender { dv fingerprint } v createdBy { id name type } updatedBy { id name } createdAt updatedAt ${TICKET_CHANGE_DATA_FIELDS.join(' ')} }`
const TicketChange = generateGqlQueries('TicketChange', TICKET_CHANGE_FIELDS)
const TICKET_FILE_FIELDS = `{ id file { id originalFilename publicUrl mimetype } organization { id } ticket { id } ${COMMON_FIELDS} }`
const TicketFile = generateGqlQueries('TicketFile', TICKET_FILE_FIELDS)
const TICKET_COMMENT_FIELDS = `{ ticket { id } user { id name type } type content ${COMMON_FIELDS} }`
const TicketComment = generateGqlQueries('TicketComment', TICKET_COMMENT_FIELDS)

const RESIDENT_TICKET_FIELDS = `{ organization { id name } property { id name address } unitName sectionName floorName number client { id name } clientName clientEmail clientPhone status { id name type organization { id } colors { primary secondary additional } } details related { id details } isEmergency isPaid isWarranty source { id name type } id dv sender { dv fingerprint } v deletedAt newId createdAt updatedAt placeClassifier { id } problemClassifier { id } ${TICKET_CLASSIFIER_ATTRIBUTES_FIELDS} }`

// Actually there is no `ResidentTicket` Keystone schema presented.
// Here we will get a set of declarations of GraphQL mutation query strings for CRUD operations.
// We have corresponding custom mutations `createResidentTicket` and `updateResidentTicket` for them.
const ResidentTicket = generateGqlQueries('ResidentTicket', RESIDENT_TICKET_FIELDS)

const TICKET_PLACE_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketPlaceClassifier = generateGqlQueries('TicketPlaceClassifier', TICKET_PLACE_CLASSIFIER_FIELDS)

const TICKET_CATEGORY_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketCategoryClassifier = generateGqlQueries('TicketCategoryClassifier', TICKET_CATEGORY_CLASSIFIER_FIELDS)

const TICKET_PROBLEM_CLASSIFIER_FIELDS = `{ organization { id } name ${COMMON_FIELDS} }`
const TicketProblemClassifier = generateGqlQueries('TicketProblemClassifier', TICKET_PROBLEM_CLASSIFIER_FIELDS)

const TICKET_CLASSIFIER_FIELDS = `{ place { id name } category { id name } problem { id name } ${COMMON_FIELDS} }`
const TicketClassifier = generateGqlQueries('TicketClassifier', TICKET_CLASSIFIER_FIELDS)

const TICKET_FILTER_FIELDS = '{ completedAt lastCommentAt organization number createdAt status details property propertyScope address clientName executor assignee executorName deadline assigneeName attributes source sectionName floorName unitType unitName placeClassifier categoryClassifier problemClassifier clientPhone createdBy contactIsNull reviewValue }'
const TICKET_FILTER_TEMPLATE_FIELDS = `{ name employee { id } fields ${TICKET_FILTER_FIELDS} ${COMMON_FIELDS} }`
const TicketFilterTemplate = generateGqlQueries('TicketFilterTemplate', TICKET_FILTER_TEMPLATE_FIELDS)


const PREDICT_TICKET_CLASSIFICATION_QUERY = gql`
    query predictTicketClassification ($data: PredictTicketClassificationInput!) {
        obj: predictTicketClassification(data: $data) { id place { id name } category { id name }  }
    }
`

const TICKET_COMMENT_FILE_FIELDS = `{ id file { id originalFilename publicUrl mimetype } organization { id } ticketComment { id } ticket { id } ${COMMON_FIELDS} }`
const TicketCommentFile = generateGqlQueries('TicketCommentFile', TICKET_COMMENT_FILE_FIELDS)

const TICKET_COMMENTS_TIME_FIELDS = `{ organization { id } ticket { id } lastCommentAt lastResidentCommentAt ${COMMON_FIELDS} }`
const TicketCommentsTime = generateGqlQueries('TicketCommentsTime', TICKET_COMMENTS_TIME_FIELDS)

const USER_TICKET_COMMENT_READ_TIME_FIELDS = `{ user { id } ticket { id } readResidentCommentAt readCommentAt ${COMMON_FIELDS} }`
const UserTicketCommentReadTime = generateGqlQueries('UserTicketCommentReadTime', USER_TICKET_COMMENT_READ_TIME_FIELDS)

const TICKET_PROPERTY_HINT_FIELDS = `{ organization { id name } name content ${COMMON_FIELDS} }`
const TicketPropertyHint = generateGqlQueries('TicketPropertyHint', TICKET_PROPERTY_HINT_FIELDS)

const TICKET_PROPERTY_HINT_PROPERTY_FIELDS = `{ organization { id } ticketPropertyHint { id } property { ${TICKET_PROPERTY_FIELDS} } ${COMMON_FIELDS} }`
const TicketPropertyHintProperty = generateGqlQueries('TicketPropertyHintProperty', TICKET_PROPERTY_HINT_PROPERTY_FIELDS)

const TICKET_EXPORT_TASK_OPTIONS_FIELDS = [
    'commentIds',
    'haveAllComments',
    'haveListCompletedWorks',
    'haveConsumedMaterials',
    'haveTotalCostWork',
]
const TICKET_EXPORT_TASK_FIELDS = `{ status format exportedRecordsCount totalRecordsCount file { id originalFilename publicUrl mimetype } where sortBy locale timeZone __typename ${COMMON_FIELDS} options {${TICKET_EXPORT_TASK_OPTIONS_FIELDS.join(' ')}} }`
const TicketExportTask = generateGqlQueries('TicketExportTask', TICKET_EXPORT_TASK_FIELDS)

const TICKET_ORGANIZATION_SETTING_FIELDS = `{ organization { id } defaultDeadlineDuration paidDeadlineDuration emergencyDeadlineDuration warrantyDeadlineDuration ${COMMON_FIELDS} }`
const TicketOrganizationSetting = generateGqlQueries('TicketOrganizationSetting', TICKET_ORGANIZATION_SETTING_FIELDS)

/* AUTOGENERATE MARKER <CONST> */
module.exports = {
    Ticket,
    TicketStatus,
    TicketChange,
    TicketSource,
    ResidentTicket,
    TicketFile,
    TICKET_CHANGE_DATA_FIELDS,
    TicketComment,
    SHARE_TICKET_MUTATION,
    TicketPlaceClassifier,
    TicketCategoryClassifier,
    TicketProblemClassifier,
    TicketClassifier,
    RESIDENT_TICKET_FIELDS,
    TicketFilterTemplate,
    PREDICT_TICKET_CLASSIFICATION_QUERY,
    TicketCommentFile,
    TicketCommentsTime,
    UserTicketCommentReadTime,
    TicketPropertyHint,
    TicketPropertyHintProperty,
    TicketExportTask,
    TicketOrganizationSetting,
    TICKET_PROPERTY_FIELDS,
/* AUTOGENERATE MARKER <EXPORTS> */
}
