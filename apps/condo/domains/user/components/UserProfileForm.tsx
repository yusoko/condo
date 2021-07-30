import { Col, Form, Input, Row, Space, Typography } from 'antd'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import React from 'react'
import { User } from '@condo/domains/user/utils/clientSchema'
import { useIntl } from '@core/next/intl'
import { useAuth } from '@core/next/auth'
import { Button } from '@condo/domains/common/components/Button'
import { FormWithAction } from '@condo/domains/common/components/containers/FormList'
import { FormResetButton } from '@condo/domains/common/components/FormResetButton'
import { UserAvatar } from './UserAvatar'
import { UserPasswordResetButton } from './UserPasswordResetButton'
import { useValidations } from '@condo/domains/common/hooks/useValidations'

const INPUT_LAYOUT_PROPS = {
    labelCol: {
        span: 9,
    },
    wrapperCol: {
        span: 15,
    },
    style: {
        paddingBottom: '24px',
        maxWidth: '453px',
    },
}

export const UserProfileForm = () => {
    const intl = useIntl()
    const router = useRouter()
    const FullNameLabel = intl.formatMessage({ id: 'pages.auth.register.field.Name' })
    const EmailLabel = intl.formatMessage({ id: 'field.EMail' })
    const PasswordLabel = intl.formatMessage({ id: 'pages.auth.signin.field.Password' })
    const ApplyChangesMessage = intl.formatMessage({ id: 'ApplyChanges' })
    const PleaseInputYourEmailMessage = intl.formatMessage({ id: 'pages.auth.PleaseInputYourEmail' })
    const MinLengthError = intl.formatMessage({ id: 'field.ClientName.minLengthError' })
    const ProfileUpdateTitle = intl.formatMessage({ id: 'profile.Update' })

    const { user } = useAuth()
    const updateUserAction = User.useUpdate({}, () => router.push('/user/'))
    const formAction = (formValues) => updateUserAction(formValues, user)

    const { combiner, requiredValidator, emailValidator, messageChanger } = useValidations()
    const minLengthValidator = {
        min: 2,
        message: MinLengthError,
    }
    const validations = {
        email: combiner(messageChanger(requiredValidator, PleaseInputYourEmailMessage), emailValidator),
        name: combiner(requiredValidator, minLengthValidator),
    }

    const initialValues = {
        name: get(user, 'name'),
        email: get(user, 'email'),
        avatar: get(user, 'avatar'),
    }

    return (
        <FormWithAction
            action={formAction}
            initialValues={initialValues}
            layout={'horizontal'}
            validateTrigger={['onBlur', 'onSubmit']}
        >
            {({ handleSave, isLoading }) => {
                return (
                    <Row>
                        <Col span={3}>
                            <Form.Item name={'avatar'}>
                                <UserAvatar borderRadius={24}/>
                            </Form.Item>
                        </Col>
                        <Col span={20} push={1}>
                            <Row gutter={[0, 40]}>
                                <Col span={24}>
                                    <Typography.Title
                                        level={1}
                                        style={{ margin: 0, fontWeight: 'bold' }}
                                    >
                                        {ProfileUpdateTitle}
                                    </Typography.Title>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        {...INPUT_LAYOUT_PROPS}
                                        labelAlign={'left'}
                                        name={'name'}
                                        label={FullNameLabel}
                                        rules={validations.name}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        {...INPUT_LAYOUT_PROPS}
                                        labelAlign={'left'}
                                        name={'email'}
                                        label={EmailLabel}
                                        rules={validations.email}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item {...INPUT_LAYOUT_PROPS} labelAlign={'left'} label={PasswordLabel}>
                                        <UserPasswordResetButton/>
                                    </Form.Item>
                                    <Space size={40} style={{ paddingTop: '36px' }}>
                                        <FormResetButton
                                            type={'sberPrimary'}
                                            secondary
                                        />
                                        <Button
                                            key={'submit'}
                                            onClick={handleSave}
                                            type={'sberPrimary'}
                                            loading={isLoading}
                                        >
                                            {ApplyChangesMessage}
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )
            }}
        </FormWithAction>
    )
}

