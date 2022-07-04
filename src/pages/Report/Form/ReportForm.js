import { CloseCircleFilled, CloseOutlined, CloseSquareFilled, EyeOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal } from '../../../redux/app/action'
import { editReport } from '../../../redux/report/action'
import { FormWrapper } from '../../User/Form/UserForm.style'


const ReportForm = props => {
    const [form] = Form.useForm()
    const { dataModal } = useSelector(state => state.app);
    const dispatch = useDispatch();


    const handleOnFinish = (values) => {
        delete values.type;
        delete values.name;
        delete values.description;
        if (dataModal?._id) {
            dispatch(editReport({ url: `/${dataModal._id}`, data: values, method: 'patch' }))
        } else {

            dispatch(editReport({ url: ``, data: values, method: 'post' }))
        }

    }
    return (
        <FormWrapper layout="horizontal" initialValues={{ ...dataModal, ...dataModal?.type, }} labelWrap={true} labelCol={{
            flex: '140px'
        }} form={form} onFinish={handleOnFinish}>
            <Row gap={[12, 12]}>
                <Col xl={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Loại báo cáo" name="type">
                        <Select disabled>
                            <Select.Option key={"C"}>
                                Nội dung
                            </Select.Option>
                            <Select.Option key={"A"}>
                                Tài khoản
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Chủ đề vi phạm" name="name">
                        <Input readOnly={true}></Input>
                    </Form.Item>
                </Col >
                <Col xl={12} md={12} sm={24} xs={24}>

                    <Form.Item label="Thông tin thêm" name="description">
                        <Input readOnly></Input>
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="status">
                        <Select >
                            <Select.Option key={"P"}>
                                Đang chờ xử lý
                            </Select.Option>
                            <Select.Option key={"I"}>
                                Đang xử lý
                            </Select.Option>
                            <Select.Option key={"R"}>
                                Đã xử lý
                            </Select.Option>
                        </Select>
                    </Form.Item>


                </Col >


            </Row>
            <Row gutter={[12, 12]} justify="end">
                <Col>
                    <Button icon={<EyeOutlined />} size="large" type="primary" >
                        {dataModal?.type?.type === 'C' ? <a style={{
                            color: 'white'
                        }} href={`${process.env.REACT_APP_CLIENT_SERVER}/posts/${dataModal?.post?._id}`} target="_blank">Xem nội dung vi phạm</a> : <a style={{
                            color: 'white'
                        }} href={`${process.env.REACT_APP_CLIENT_SERVER}/posts/${dataModal?.user?.username}`} target="_blank">Xem tài khoản vi phạm</a>}
                    </Button>
                </Col>
                <Col>
                    <Button size="large" icon={<SaveOutlined />} htmlType="submit" type="primary">
                        Lưu
                    </Button>
                </Col>
                <Col>
                    <Button size="large" icon={<CloseCircleFilled />} type="default" onClick={() => {
                        dispatch(toggleModal(null))
                    }}>
                        Hủy
                    </Button>
                </Col>
            </Row>
        </FormWrapper>
    )
}

ReportForm.propTypes = {}

export default ReportForm