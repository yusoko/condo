/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */

// GQL Names
const BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME = 'BillingReceiptToPayDetailsField'
const BILLING_RECEIPT_TO_PAY_DETAILS_INPUT_NAME = 'BillingReceiptToPayDetailsFieldInput'
const BILLING_RECEIPT_SERVICE_TO_PAY_DETAILS_FIELD_NAME = 'BillingReceiptServiceToPayDetailsField'
const BILLING_RECEIPT_SERVICE_TO_PAY_DETAILS_INPUT_NAME = 'BillingReceiptServiceToPayDetailsFieldInput'
const BILLING_RECEIPT_SERVICE_FIELD_NAME = 'BillingReceiptServiceField'
const BILLING_RECEIPT_SERVICE_INPUT_NAME = 'BillingReceiptServiceFieldInput'
const BILLING_RECEIPT_SERVICES_FIELD = `[${BILLING_RECEIPT_SERVICE_FIELD_NAME}!]`
const BILLING_RECEIPT_SERVICES_INPUT = `[${BILLING_RECEIPT_SERVICE_INPUT_NAME}!]`
const BILLING_RECEIPT_RECIPIENT_FIELD_NAME = 'BillingReceiptsRecipientField'
const BILLING_RECEIPT_RECIPIENT_INPUT_NAME = 'BillingReceiptsRecipientFieldInput'
const BILLING_INTEGRATION_OPTIONS_FIELD_NAME = 'BillingIntegrationOptionsField'
const BILLING_INTEGRATION_OPTIONS_INPUT_NAME = 'BillingIntegrationOptionsFieldInput'
const BILLING_INTEGRATION_OPTION_FIELD_NAME = 'BillingIntegrationOptionField'
const BILLING_INTEGRATION_OPTION_INPUT_NAME = 'BillingIntegrationOptionFieldInput'
const BILLING_INTEGRATION_OPTION_DETAILS_FIELD_NAME = 'BillingIntegrationOptionDetailsField'
const BILLING_INTEGRATION_OPTION_DETAILS_INPUT_NAME = 'BillingIntegrationOptionDetailsFieldInput'
const BILLING_CONTEXT_INTEGRATION_OPTION_FIELD_NAME = 'BillingIntegrationOrganizationContextIntegrationOptionField'
const BILLING_CONTEXT_INTEGRATION_OPTION_INPUT_NAME = 'BillingIntegrationOrganizationContextIntegrationOptionFieldInput'
const BILLING_INTEGRATION_DATA_FORMAT_FIELD_NAME = 'BillingIntegrationDataFormatField'
const BILLING_INTEGRATION_DATA_FORMAT_INPUT_NAME = 'BillingIntegrationDataFormatFieldInput'

const BILLING_RECEIPT_FILE_FOLDER_NAME = 'billing-receipt-pdf'

const DEFAULT_BILLING_INTEGRATION_NAME = 'default'
const DEFAULT_BILLING_INTEGRATION_GROUP = 'common'

const ACCRUALS_TAB_KEY = 'accruals'
const PAYMENTS_TAB_KEY = 'payments'
const EXTENSION_TAB_KEY = 'extension'

const BILLING_ACCOUNT_OWNER_TYPE_PERSON = 'person'
const BILLING_ACCOUNT_OWNER_TYPE_COMPANY = 'company'

const BILLING_ACCOUNT_OWNER_TYPES = [BILLING_ACCOUNT_OWNER_TYPE_PERSON, BILLING_ACCOUNT_OWNER_TYPE_COMPANY]

// Billing categories are constants within DB and added via migration 0121, so it's safe to use this value
const DEFAULT_BILLING_CATEGORY_ID = '928c97ef-5289-4daa-b80e-4b9fed50c629'
const HOUSING_CATEGORY_ID = '928c97ef-5289-4daa-b80e-4b9fed50c629'
const REPAIR_CATEGORY_ID = 'c0b9db6a-c351-4bf4-aa35-8e5a500d0195'

const PERIOD_REGEX = /^\d{4}-\d{2}-01$/

module.exports = {
    BILLING_RECEIPT_SERVICE_FIELD_NAME,
    BILLING_RECEIPT_SERVICE_INPUT_NAME,
    BILLING_RECEIPT_SERVICE_TO_PAY_DETAILS_FIELD_NAME,
    BILLING_RECEIPT_SERVICE_TO_PAY_DETAILS_INPUT_NAME,
    BILLING_RECEIPT_TO_PAY_DETAILS_FIELD_NAME,
    BILLING_RECEIPT_TO_PAY_DETAILS_INPUT_NAME,
    BILLING_RECEIPT_RECIPIENT_FIELD_NAME,
    BILLING_RECEIPT_RECIPIENT_INPUT_NAME,
    BILLING_RECEIPT_SERVICES_FIELD,
    BILLING_RECEIPT_SERVICES_INPUT,
    DEFAULT_BILLING_INTEGRATION_NAME,
    DEFAULT_BILLING_INTEGRATION_GROUP,
    BILLING_INTEGRATION_OPTIONS_FIELD_NAME,
    BILLING_INTEGRATION_OPTIONS_INPUT_NAME,
    BILLING_INTEGRATION_OPTION_FIELD_NAME,
    BILLING_INTEGRATION_OPTION_INPUT_NAME,
    BILLING_INTEGRATION_OPTION_DETAILS_FIELD_NAME,
    BILLING_INTEGRATION_OPTION_DETAILS_INPUT_NAME,
    BILLING_CONTEXT_INTEGRATION_OPTION_FIELD_NAME,
    BILLING_CONTEXT_INTEGRATION_OPTION_INPUT_NAME,
    BILLING_INTEGRATION_DATA_FORMAT_FIELD_NAME,
    BILLING_INTEGRATION_DATA_FORMAT_INPUT_NAME,
    BILLING_RECEIPT_FILE_FOLDER_NAME,
    ACCRUALS_TAB_KEY,
    PAYMENTS_TAB_KEY,
    EXTENSION_TAB_KEY,
    BILLING_ACCOUNT_OWNER_TYPE_PERSON,
    BILLING_ACCOUNT_OWNER_TYPE_COMPANY,
    BILLING_ACCOUNT_OWNER_TYPES,
    DEFAULT_BILLING_CATEGORY_ID,
    HOUSING_CATEGORY_ID,
    REPAIR_CATEGORY_ID,
    PERIOD_REGEX,
}
