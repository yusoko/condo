// @ts-nocheck
/**
 * Generated by `createschema news.NewsItemSharing 'b2bApp:Relationship:B2BApp:CASCADE; newsItem:Relationship:NewsItem:CASCADE; sharingParams:Json; status:Select:processing,published,moderation,declined,archive; statusMessage:Text; lastGetRecipientsRequest:Json; lastPostRequest:Json; lastGetStatusRequest:Json; publicationViewsCount:Integer;'`
 */

const { get } = require('lodash')

const { throwAuthenticationError } = require('@open-condo/keystone/apolloErrorFormatter')
const { getById } = require('@open-condo/keystone/schema')

const {
    queryOrganizationEmployeeFor,
    queryOrganizationEmployeeFromRelatedOrganizationFor, checkPermissionInUserOrganizationOrRelatedOrganization,
} = require('../../organization/utils/accessSchema')
const { RESIDENT } = require('../../user/constants/common')

async function canReadNewsItemSharings ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    if (user.isAdmin || user.isSupport) return {}

    return {
        b2bAppContext: {
            organization: {
                OR: [
                    queryOrganizationEmployeeFor(user.id, 'canReadNewsItems'),
                    queryOrganizationEmployeeFromRelatedOrganizationFor(user.id, 'canReadNewsItems'),
                ],
                deletedAt: null,
            },
            deletedAt: null,
        },
    }
}

async function canManageNewsItemSharings ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin || user.isSupport) return true
    if (user.type === RESIDENT) return false

    let organizationId

    if (operation === 'create') {
        const newsItem = await getById('NewsItem', get(originalInput, ['newsItem', 'connect', 'id']) )
        organizationId = get(newsItem, 'organization', null)
    } else if (operation === 'update') {
        if (!itemId) return false
        const newsItemSharing = await getById('NewsItemSharing', itemId )
        const newsItem = await getById('NewsItem', newsItemSharing.newsItem)
        organizationId = get(newsItem, 'organization', null)
    }

    if (!organizationId) return false

    return await checkPermissionInUserOrganizationOrRelatedOrganization(user.id, organizationId, 'canManageNewsItems')
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadNewsItemSharings,
    canManageNewsItemSharings,
}
