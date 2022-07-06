import React from 'react'
import PropTypes from 'prop-types'
import { FormWrapper, UserFormWrapper } from './UserForm.style'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { handleCRUDUser } from '../../../redux/user/saga'
import { editUser } from '../../../redux/user/action'
import { toggleModal } from '../../../redux/app/action'
import { CloseCircleFilled, SaveOutlined } from '@ant-design/icons'


const UserForm = props => {
    const [form] = Form.useForm()
    const { dataModal } = useSelector(state => state.app);
    const dispatch = useDispatch();
    const isDisabled = !!dataModal?.deleted;


    const handleOnFinish = (values) => {
        if (dataModal?._id) {
            dispatch(editUser({ url: `/${dataModal._id}`, data: values, method: 'patch' }))
        } else {

            dispatch(editUser({ url: ``, data: values, method: 'post' }))
        }

    }
    return (
        <FormWrapper layout="horizontal" initialValues={{ ...dataModal, dob: dataModal?.dob ? moment(dataModal?.dob) : null }} labelWrap={true} labelCol={{
            flex: '140px'
        }} form={form} onFinish={handleOnFinish}>
            <Row gap={[12, 12]}>
                <Col xl={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Tên tài khoản" name="username">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="mobile">
                        <Input></Input>
                    </Form.Item>
                    {!dataModal?._id && <Form.Item label="Mật khẩu" name="password">
                        <Input.Password></Input.Password>
                    </Form.Item>}

                </Col >
                <Col xl={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Họ tên" name="fullname">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="dob">
                        <DatePicker></DatePicker>
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status">
                        <Select>
                            <Select.Option key={"I"}>
                                Chưa kích hoạt
                            </Select.Option>
                            <Select.Option key={"A"}>
                                Đã kích hoạt
                            </Select.Option>
                            <Select.Option key={"B"}>
                                Khóa
                            </Select.Option>
                        </Select>
                    </Form.Item>

                </Col>
            </Row>
            <Row gutter={[12, 12]} justify="end">
                <Col>
                    <Button disabled={isDisabled} icon={<SaveOutlined />} size="large" htmlType="submit" type="primary">
                        Lưu
                    </Button>
                </Col>
                <Col>
                    <Button size="large" type="default" icon={<CloseCircleFilled />} onClick={() => {
                        dispatch(toggleModal(null))
                    }}>
                        Hủy
                    </Button>
                </Col>
            </Row>
        </FormWrapper>
    )
}

UserForm.propTypes = {}

export default UserForm