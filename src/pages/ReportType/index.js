import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Layout, Popconfirm, Row, Select } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '../../components/DataTable2'
import MainModal from '../../components/MainModal'
import { toggleModal } from '../../redux/app/action'
import { deleteReportType, getAllReportTypeBasic } from '../../redux/reportType/action'
import ReportTypeForm from './Form/ReportTypeForm'

const reportTypes = {
    'A': 'Tài khoản',
    'C': 'Nội dung'
}

const ReportType = props => {
    const gridRef = useRef();
    const [form] = Form.useForm()
    const { data, loading, success } = useSelector(state => state.reportType)
    const [filter, setFilter] = useState({
        page: 1,
        limit: 20,
        filter: [],
    });
    const dispatch = useDispatch()





    const columnDefs = useMemo(
        () => [
            {
                field: 'type',
                sortable: true,
                filter: true,
                suppressMenu: true,
                floatingFilter: true,
                headerName: 'Loại báo cáo',
                minWidth: 200,
                cellRenderer: (params) => reportTypes[params?.value] || ""

            },
            {
                field: 'name',
                sortable: true,
                filter: true,
                headerName: 'Chủ đề vi phạm',
                suppressMenu: true,
                floatingFilter: true,
                minWidth: 200,
            },


            {
                field: 'action',
                headerName: 'Hành động',
                pinned: 'right',
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
                                    dispatch(deleteReportType({
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
            dispatch(getAllReportTypeBasic(filter))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    useEffect(() => {
        dispatch(getAllReportTypeBasic(filter))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])
    return (
        <Layout>
            <Layout.Content>
                <Row gutter={10}>
                    <Col flex={1}>
                        <Form
                            labelWrap={true}

                            form={form}
                            onFinish={onFilter}
                            style={{
                                display: 'flex',
                                gap: '1rem',
                            }}
                        >
                            <Form.Item label="Loại báo cáo" name="type" >
                                <Select allowClear placeholder="Loại báo cáo" >
                                    <Select.Option value="C">Nội dung</Select.Option>
                                    <Select.Option value="A">Tài khoản</Select.Option>
                                </Select>
                            </Form.Item>
                            <Col>
                                <Form.Item label="Chủ đề vi phạm" name={"name"} >
                                    <Input placeholder={'Chủ đề vi phạm'} />
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
                <MainModal loading={loading} form={<ReportTypeForm />} />
                {/* <ModalUser filter={filter} /> */}

                <DataTable
                    onPageChange={onFilter}
                    data={data}
                    colDef={columnDefs}
                    paginate={true}
                    ref={gridRef}
                    loading={loading}
                />
            </Layout.Content>
        </Layout>
    )
}
ReportType.propTypes = {}

export default ReportType