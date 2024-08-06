/**
 * Generated by `createschema condo.User 'name:Text; isSupport:Checkbox; isAdmin:Checkbox; email:Text;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateServerUtils } = require('@open-condo/codegen/generate.server.utils')

const { User: UserGQL } = require('@{{name}}/domains/user/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const User = generateServerUtils(UserGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    User,
/* AUTOGENERATE MARKER <EXPORTS> */
}
