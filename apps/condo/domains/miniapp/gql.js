/**
 * Generated by `createservice miniapp.AllOrganizationAppsService --type queries`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { gql } = require('graphql-tag')

const APP_FIELDS = '{ id name shortDescription connected type category }'
 
const ALL_ORGANIZATION_APPS_QUERY = gql`
    query getAllOrganizationApps ($data: AllOrganizationAppsInput!) {
        objs: allOrganizationApps (data: $data) ${APP_FIELDS}
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    ALL_ORGANIZATION_APPS_QUERY,
/* AUTOGENERATE MARKER <EXPORTS> */
}
