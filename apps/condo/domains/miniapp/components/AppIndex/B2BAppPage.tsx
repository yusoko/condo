import React, { useEffect } from 'react'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@open-condo/next/auth'
import { useIntl } from '@open-condo/next/intl'
import { useOrganization } from '@open-condo/next/organization'
import { Typography } from '@open-condo/ui'
import LoadingOrErrorPage from '@condo/domains/common/components/containers/LoadingOrErrorPage'
import { PageContent, PageWrapper, PageHeader } from '@condo/domains/common/components/containers/BaseLayout'
import IFrame from '@condo/domains/common/components/IFrame'
import { B2BAppContext } from '@condo/domains/miniapp/utils/clientSchema'
import { B2B_APP_TYPE } from '@condo/domains/miniapp/constants'


type B2BAppPageProps = {
    id: string
}

export const B2BAppPage: React.FC<B2BAppPageProps> = ({ id }) => {
    const intl = useIntl()
    const FallbackPageTitle = intl.formatMessage({ id: 'global.section.miniapps' })
    const NoPermissionMessage = intl.formatMessage({ id: 'global.noPageViewPermission' })

    const router = useRouter()
    const auth = useAuth()
    const isSupport = get(auth, ['user', 'isSupport'], false)
    const isAdmin = get(auth, ['user', 'isAdmin'], false)
    const userOrganization = useOrganization()
    const organizationId = get(userOrganization, ['organization', 'id'], null)

    const {
        obj: context,
        loading,
        error,
    } = B2BAppContext.useObject({ where: { app: { id }, organization: { id: organizationId } } })

    const appUrl = get(context, ['app', 'appUrl'], null)
    const appName = get(context, ['app', 'name'], null)

    // NOTE 1: Page visiting is valid if context exist and app has appUrl
    // NOTE 2: In case of invalid id it will redirect to about page, where appId is checked
    useEffect(() => {
        if (!loading && !error && (!context || !appUrl)) {
            router.push(`/miniapps/${id}/about?type=${B2B_APP_TYPE}`)
        }
    }, [id, loading, error, context, appUrl, router])

    if (isSupport || isAdmin) {
        return <LoadingOrErrorPage title={FallbackPageTitle} error={NoPermissionMessage}/>
    }


    return (
        <>
            <Head>
                <title>{appName || FallbackPageTitle}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={<Typography.Title level={1}>{appName || FallbackPageTitle}</Typography.Title>} spaced/>
                <PageContent>
                    {appUrl && (
                        <IFrame pageUrl={appUrl}/>
                    )}
                </PageContent>
            </PageWrapper>
        </>
    )
}