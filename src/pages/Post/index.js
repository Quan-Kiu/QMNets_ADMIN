import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Col, Form, Layout, message, Popconfirm, Row, Select, Tag } from 'antd'
import moment from 'moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '../../components/DataTable2'
import MainModal from '../../components/MainModal'
import { toggleModal } from '../../redux/app/action'
import { deletePost, getAllPostBasic } from '../../redux/post/action'
import callAPi from '../../utils/apiRequest'
import PostForm from './Form/PostForm'

const posts = {
    'A': 'Tài khoản',
    'C': 'Nội dung'
}

const postStatus = {
    'P': <Tag color={"#f50"}>Chờ xử lý</Tag>,
    'I': <Tag color={"#2db7f5"}>Đang xử lý</Tag>,
    'R': <Tag color={"#87d068"}>Đã xử lý</Tag>
}

const Post = props => {
    const gridRef = useRef();
    const [form] = Form.useForm()
    const { data, loading, success } = useSelector(state => state.post)
    const [filter, setFilter] = useState({
        page: 1,
        limit: 20,
        filter: [],
    });
    const dispatch = useDispatch()
    const [postType, setPostType] = useState([]);




    const columnDefs = useMemo(
        () => [

            {
                field: 'postType',
                sortable: true,
                headerName: 'Loại báo cáo',
                minWidth: 100,
                cellRenderer: (params) => posts[params?.value?.type] || ""

            },
            {
                field: 'postType',
                sortable: true,
                headerName: 'Chủ đề vi phạm',
                minWidth: 100,
                cellRenderer: (params) => params?.value?.name || ""
            },
            {
                field: 'description',
                sortable: true,
                headerName: 'Thông tin thêm',
                minWidth: 300,
            },
            {
                field: 'createdAt',
                sortable: true,
                headerName: 'Báo cáo lúc',
                minWidth: 200,
                cellRenderer: (params) => moment(params?.value).format('DD-MM-YYYY HH:mm') || ""
            },
            {
                field: 'status',
                headerName: 'Trạng thái',
                minWidth: 100,
                cellRenderer: (params) => postStatus[params?.value]
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
                                    dispatch(deletePost({
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
    const fetch = async (type) => {
        try {
            const res = await callAPi('admin/postTypes/getAll', 'post', {
                page: 1,
                limit: 999999999999,
                filter: [{
                    type: 'type',
                    name: type,
                    operator: 'EQUAL'
                }]
            })

            if (res.success) {
                setPostType(res.data.rows);
            }

        } catch (error) {
            message.error(error.message)
        }
    }



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
            dispatch(getAllPostBasic(filter))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    useEffect(() => {
        dispatch(getAllPostBasic(filter))
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
                            <Form.Item label="Loại báo cáo" name="postType.type" >
                                <Select allowClear onChange={(v) => {
                                    fetch(v)
                                }} placeholder="Loại báo cáo" >
                                    <Select.Option value="C">Nội dung</Select.Option>
                                    <Select.Option value="A">Tài khoản</Select.Option>
                                </Select>
                            </Form.Item>
                            <Col>
                                <Form.Item label="Chủ đề vi phạm" name={"postType.name"} >
                                    <Select allowClear placeholder="Chủ đề vi phạm">
                                        {
                                            postType.map((r) => <Select.Option value={r.name}>{r.name}</Select.Option>)
                                        }

                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col>
                                <Form.Item label="Trạng thái" name="status" >
                                    <Select allowClear placeholder="Trạng thái" >
                                        <Select.Option key={"P"}>
                                            Đang chờ duyệt
                                        </Select.Option>
                                        <Select.Option key={"I"}>
                                            Đang duyệt
                                        </Select.Option>
                                        <Select.Option key={"R"}>
                                            Đã duyệt
                                        </Select.Option>
                                        <Select.Option key={"N"}>
                                            Không duyệt
                                        </Select.Option>
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
                <MainModal loading={loading} form={<PostForm />} />
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
Post.propTypes = {}

export default Post