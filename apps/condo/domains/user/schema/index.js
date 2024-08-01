/**
 * This file is autogenerated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 * In most cases you should not change it by hands. And please don't remove `AUTOGENERATE MARKER`s
 */

const { AuthenticateUserWithPhoneAndPasswordService } = require('./AuthenticateUserWithPhoneAndPasswordService')
const { ChangePhoneNumberResidentUserService } = require('./ChangePhoneNumberResidentUserService')
const { CheckUserExistenceService } = require('./CheckUserExistenceService')
const { ConfirmPhoneAction } = require('./ConfirmPhoneAction')
const { ConfirmPhoneActionService } = require('./ConfirmPhoneActionService')
const { ExternalTokenAccessRight } = require('./ExternalTokenAccessRight')
const { ForgotPasswordService } = require('./ForgotPasswordService')
const { GetAccessTokenByUserIdService } = require('./GetAccessTokenByUserIdService')
const { OidcClient } = require('./OidcClient')
const { RegisterNewServiceUserService } = require('./RegisterNewServiceUserService')
const { RegisterNewUserService } = require('./RegisterNewUserService')
const { ResetUserService } = require('./ResetUserService')
const { SendMessageToSupportService } = require('./SendMessageToSupportService')
const { SigninAsUserService } = require('./SigninAsUserService')
const { SigninResidentUserService } = require('./SigninResidentUserService')
const { User } = require('./User')
const { UserExternalIdentity } = require('./UserExternalIdentity')
const { UserRightsSet } = require('./UserRightsSet')
/* AUTOGENERATE MARKER <REQUIRE> */

module.exports = {
    User,
    RegisterNewUserService,
    AuthenticateUserWithPhoneAndPasswordService,
    ForgotPasswordService,
    ConfirmPhoneAction,
    ConfirmPhoneActionService,
    SigninResidentUserService,
    ChangePhoneNumberResidentUserService,
    SigninAsUserService,
    RegisterNewServiceUserService,
    SendMessageToSupportService,
    ResetUserService,
    OidcClient,
    UserExternalIdentity,
    ExternalTokenAccessRight,
    GetAccessTokenByUserIdService,
    UserRightsSet,
    CheckUserExistenceService,
/* AUTOGENERATE MARKER <EXPORTS> */
}
