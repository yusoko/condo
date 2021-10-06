/**
 * Generated by `createschema resident.Resident 'user:Relationship:User:CASCADE; organization:Relationship:Organization:PROTECT; property:Relationship:Property:PROTECT; billingAccount?:Relationship:BillingAccount:SET_NULL; unitName:Text;'`
 */

/**
 * Payment categories meta used as a temporary, but somewhat generic solution 
 * to the problem of differentiating billing and acquiring on mobile device
 *
 * Problem:
 *
 * Our system might have a generic default billing, that is enabled by default
 * for all Residents. In Russia this billing is SBER UPS (СБЕР ЕПС)
 *
 * Our system might also have an organization specific billing,
 * that is disabled by default and should be enabled manually.
 * An example in Russia: dom.gosuslugi.ru billing.
 *
 * Same goes for the acquiring: you have the default and org-specific
 *
 * Billing or Acquiring can also be toggled based on the payment category. For example:
 * - Cold Water: use default billing and default acquiring
 * - Housing Payment: use dom.gosuslugi.ru billing and SBER acquiring
 *
 * Depending on a chosen billing mobile app uses different screens and
 * different flow.
 *
 * Condo-Api should have a way to tell mobile app which billing or acquiring it
 * should use per payment category
 *
 * --
 *
 * Current solution
 *
 * A hardcoded constant that is planned to move to separate model in the future.
 * 
 * Model PaymentCategory { 
 *     name: str                             - Name of the category to pay for: Cold Water, Housing Payment, Bill
 *     canGetBillingFromOrganization: bool   - Whether or not to get billing from organization. If set to false, then default billing is used
 *     canGetAcquiringFromOrganization: bool - see canGetBillingFromOrganization field description
 * }
 *  
 * todo: @toplenboren - when we sort this out on business side, move this hardcode to the model!
 */
const PAYMENT_CATEGORIES_META = [
    {
        name: 'Квартплата',
        canGetBillingFromOrganization: true,
        canGetAcquiringFromOrganization: true,
    },
    {
        name: 'Интернет, ТВ, домашний телефон',
        canGetBillingFromOrganization: false,
        canGetAcquiringFromOrganization: false,
    },
]

module.exports = {
    PAYMENT_CATEGORIES_META,
}
