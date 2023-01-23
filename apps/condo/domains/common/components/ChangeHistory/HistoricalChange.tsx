import React, { ReactElement, useMemo } from 'react'
import { useLayoutContext } from '../LayoutContext'
import dayjs from 'dayjs'
import { Col, Row } from 'antd'
import { Typography } from '@open-condo/ui'
import { Maybe } from '@app/condo/schema'


export type BaseChangesType = {
    createdAt?: Maybe<string>
    id: string
}

type UseChangedFieldMessagesOfType<ChangesType> = (changesValue: ChangesType) => Array<{
    field: string
    message: ReactElement | null
}>

type HistoricalChangeInputType<ChangesType> = {
    changesValue: ChangesType
    useChangedFieldMessagesOf: UseChangedFieldMessagesOfType<ChangesType>
    Diff: React.FC<{ className?: string }>
}

type HistoricalChangeReturnType = ReactElement

export const HistoricalChange = <ChangesType extends BaseChangesType> (props: HistoricalChangeInputType<ChangesType>): HistoricalChangeReturnType => {
    const { changesValue, useChangedFieldMessagesOf, Diff } = props

    const changedFieldMessages = useChangedFieldMessagesOf(changesValue)
    const { isSmall } = useLayoutContext()

    const formattedDate = useMemo(() => dayjs(changesValue.createdAt).format('DD.MM.YYYY'), [changesValue.createdAt])
    const formattedTime = useMemo(() => dayjs(changesValue.createdAt).format('HH:mm'), [changesValue.createdAt])

    return (
        <Row gutter={[12, 12]}>
            <Col xs={24} lg={6}>
                <Typography.Text disabled={isSmall}>
                    {formattedDate}
                    <Typography.Text type='secondary'>, {formattedTime}</Typography.Text>
                </Typography.Text>
            </Col>
            <Col xs={24} lg={18}>
                {changedFieldMessages.map(({ field, message }) => (
                    <Typography.Text key={field}>
                        <Diff className={field}>
                            {message}
                        </Diff>
                    </Typography.Text>
                ))}
            </Col>
        </Row>
    )
}