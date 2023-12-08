/**
 * Generated by `createschema marketplace.InvoiceContext 'organization:Relationship:Organization:PROTECT; recipient:Json; email:Text; settings:Json; state:Json;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const { gql } = require('graphql-tag')

const { generateGqlQueries } = require('@open-condo/codegen/generate.gql')

const { PROPERTY_MAP_JSON_FIELDS } = require('@condo/domains/property/gql')
const { ADDRESS_META_SUBFIELDS_QUERY_LIST, ADDRESS_META_SUBFIELDS_TABLE_LIST } = require('@condo/domains/property/schema/fields/AddressMetaField')


const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const INVOICE_CONTEXT_FIELDS = `{ integration { id name setupUrl hostUrl } organization { id } recipient { tin bic bankAccount } settings status implicitFeePercent taxRegime vatPercent salesTaxPercent currencyCode ${COMMON_FIELDS} }`
const InvoiceContext = generateGqlQueries('InvoiceContext', INVOICE_CONTEXT_FIELDS)

const MARKET_CATEGORY_FIELDS = `{ name image { publicUrl } mobileSettings { bgColor titleColor } parentCategory { id name } ${COMMON_FIELDS} }`
const MarketCategory = generateGqlQueries('MarketCategory', MARKET_CATEGORY_FIELDS)

const MARKET_ITEM_FIELDS = `{ name marketCategory { id name parentCategory { id name } image { publicUrl } } sku description organization { id } ${COMMON_FIELDS} }`
const MarketItem = generateGqlQueries('MarketItem', MARKET_ITEM_FIELDS)

const INVOICE_FIELDS = `{ context { id organization { id name } currencyCode } number property { id address addressKey addressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} } map { ${PROPERTY_MAP_JSON_FIELDS} } } unitType unitName accountNumber toPay rows { name toPay count vatPercent salesTaxPercent sku isMin currencyCode } ticket { id number property { id } unitName unitType clientName clientPhone } contact { id name phone email unitType unitName property { id } } clientName clientPhone client { id name } status paymentType publishedAt paidAt canceledAt ${COMMON_FIELDS} }`
const Invoice = generateGqlQueries('Invoice', INVOICE_FIELDS)

const MARKET_ITEM_FILE_FIELDS = `{ marketItem { id organization { id } } file { id originalFilename publicUrl mimetype } ${COMMON_FIELDS} }`
const MarketItemFile = generateGqlQueries('MarketItemFile', MARKET_ITEM_FILE_FIELDS)

const MARKET_ITEM_PRICE_FIELDS = `{ price { type group name price isMin vatPercent salesTaxPercent currencyCode } marketItem { id } ${COMMON_FIELDS} }`
const MarketItemPrice = generateGqlQueries('MarketItemPrice', MARKET_ITEM_PRICE_FIELDS)

const MARKET_PRICE_SCOPE_FIELDS = `{ marketItemPrice { id marketItem { id name sku organization { id } marketCategory { id name parentCategory { id name } } } price { type group name price isMin vatPercent salesTaxPercent currencyCode } } property { id addressMeta { ${ADDRESS_META_SUBFIELDS_TABLE_LIST} } } ${COMMON_FIELDS} }`
const MarketPriceScope = generateGqlQueries('MarketPriceScope', MARKET_PRICE_SCOPE_FIELDS)

const REGISTER_INVOICE_MUTATION = gql`
    mutation registerInvoice ($data: RegisterInvoiceInput!) {
        result: registerInvoice(data: $data) { invoice ${INVOICE_FIELDS} }
    }
`

const GET_INVOICE_BY_USER_QUERY = gql`
    query getGetInvoiceByUser ($data: GetInvoiceByUserInput!) {
        obj: executeGetInvoiceByUser(data: $data) { 
            invoices ${INVOICE_FIELDS}
            skuInfo { sku imageUrl }
        }
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    InvoiceContext,
    MarketCategory,
    MarketItem,
    Invoice,
    MarketItemFile,
    MarketItemPrice,
    MarketPriceScope,
    REGISTER_INVOICE_MUTATION,
    GET_INVOICE_BY_USER_QUERY,
/* AUTOGENERATE MARKER <EXPORTS> */
}
