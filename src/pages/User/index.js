import { Button, Col, DatePicker, Form, Image, Input, Layout, Popconfirm, Row, Select } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import DataTable from '../../components/DataTable2'
import { deleteUser, getAllUserBasic } from '../../redux/user/action'
import { statusElement } from '../../utils/element_utils'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import MainModal from '../../components/MainModal'
import { toggleModal } from '../../redux/app/action'
import UserForm from './Form/UserForm'

const User = props => {
    const gridRef = useRef();
    const [form] = Form.useForm()
    const { data, loading, success } = useSelector(state => state.user)
    const [filter, setFilter] = useState({
        page: 1,
        limit: 20,
        filter: [],
    });
    const [filterType, setFilterType] = useState('username');
    const dispatch = useDispatch()


    const columnDefs = useMemo(
        () => [
            {
                field: 'avatar',
                headerName: 'Ảnh',
                cellRenderer: (params) => {
                    return <Image src={params?.value?.url} width={40} height={40} style={{ objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />;
                },
                minWidth: 80,
                maxWidth: 80,
            },
            {
                field: 'username',
                sortable: true,
                headerName: 'Tên đăng nhập',
                filter: true,
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 200,
                maxWidth: 300,
            },
            {
                field: 'fullname',
                sortable: true,
                filter: true,
                headerName: 'Họ và tên',
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 200,
                maxWidth: 300,
            },
            {
                field: 'email',
                sortable: true,
                filter: true,
                headerName: 'Email',
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 200,
                maxWidth: 300,
            },
            {
                field: 'phone',
                sortable: true,
                filter: true,
                headerName: 'Số điện thoại',
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 200,
                maxWidth: 300,
            },
            {
                field: 'dob',
                sortable: true,
                filter: true,
                headerName: 'Ngày sinh',
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 100,
                maxWidth: 300,
                valueFormatter: (params) => {
                    if (params?.value) {

                        return moment(params?.value).format('DD-MM-YYYY')
                    } else {
                        return '';
                    }
                }
            },

            {
                field: 'status',
                floatingFilter: true,
                headerName: 'Trạng thái',
                suppressMenu: true,
                minWidth: 100,
                maxWidth: 150,
                cellRenderer: (params) => {
                    return statusElement(params?.value)
                },
            },

            {
                field: 'action',
                pinned: 'right',
                headerName: 'Hành động',
                cellStyle: {
                    display: 'flex',
                    alignItems: 'center',
                },
                minWidth: 80,
                maxWidth: 80,
                cellRenderer: (params) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <EditOutlined
                                onClick={() => {
                                    dispatch(toggleModal(params.data));
                                }}
                                style={{
                                    color: '#1890ff',
                                }}
                            />
                            <Popconfirm
                                placement="leftBottom"
                                title={'Bạn có chắc chắn muốn xóa?'}
                                onConfirm={() => {
                                    dispatch(deleteUser({
                                        url: `/${params.data._id}`,
                                        method: 'delete'
                                    }))
                                }}
                                okText="Có"
                                cancelText="Không"
                            >
                                <DeleteOutlined style={{ color: '#FF4D4F' }} />
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );


    const onFilter = (page) => {
        const values = form.getFieldsValue();

        const newFilter = Object.keys(values).reduce((prev, v) => {
            if (values[v] !== undefined && values[v] !== 'all') {
                return [...prev, {

                    type: v,
                    name: values[v],
                    operator: typeof values[v] === 'string' ? 'LIKE' : 'EQUAL'
                }]
            }
            return prev;
        }, [])

        setFilter({
            page: typeof page === 'number' ? page : 1,
            limit: 20,
            filter: newFilter
        })

    }

    useEffect(() => {
        if (success) {
            dispatch(getAllUserBasic(filter))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])



    useEffect(() => {
        dispatch(getAllUserBasic(filter))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])
    return (
        <Layout>
            <Layout.Content>
                <Row gutter={10}>
                    <Col flex={1}>
                        <Form
                            form={form}
                            onFinish={onFilter}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                            }}
                        >
                            <Form.Item initialValue={filterType}>
                                <Select onChange={(value) => {
                                    setFilterType(value);
                                }} defaultValue={filterType} >
                                    <Select.Option value="username">Tên tài khoản</Select.Option>
                                    <Select.Option value="fullname">Họ và tên</Select.Option>
                                    <Select.Option value="email">Email</Select.Option>
                                    <Select.Option value="phone">Số điện thoại</Select.Option>
                                </Select>
                            </Form.Item>
                            <Col>
                                <Form.Item name={filterType} normalize={(val) => val?.trimStart()}>
                                    <Input placeholder={'Tìm kiếm'} />
                                </Form.Item>
                            </Col>

                            <Col>
                                <Form.Item name="deleted" initialValue={"all"}>
                                    <Select>
                                        <Select.Option value={"all"}>Tất cả</Select.Option>
                                        <Select.Option value={false}>Chưa xóa</Select.Option>
                                        <Select.Option value={true}>Đã xóa</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col
                                style={{
                                    marginLeft: 'auto',
                                }}
                            >
                                <Button size="large" htmlType="submit" type="primary">
                                    Tìm kiếm
                                </Button>
                            </Col>
                        </Form>
                    </Col>

                    <Col>
                        <Button size="large" type="primary" onClick={() => {
                            dispatch(toggleModal("new"))
                        }}>
                            Thêm mới
                        </Button>
                    </Col>
                </Row>
                <MainModal loading={loading} form={<UserForm />} />
                {/* <ModalUser filter={filter} /> */}

                <DataTable
                    data={data}
                    onPageChange={onFilter}
                    colDef={columnDefs}
                    ref={gridRef}
                    loading={loading}
                />
            </Layout.Content>
        </Layout>
    )
}
User.propTypes = {}

export default User