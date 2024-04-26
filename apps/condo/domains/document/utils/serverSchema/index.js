/**
 * Generated by `createschema document.DocumentCategory 'name:Text; order:Integer;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateServerUtils } = require('@open-condo/codegen/generate.server.utils')

const { DocumentCategory: DocumentCategoryGQL } = require('@condo/domains/document/gql')
const { Document: DocumentGQL } = require('@condo/domains/document/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const DocumentCategory = generateServerUtils(DocumentCategoryGQL)
const Document = generateServerUtils(DocumentGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    DocumentCategory,
    Document,
/* AUTOGENERATE MARKER <EXPORTS> */
}