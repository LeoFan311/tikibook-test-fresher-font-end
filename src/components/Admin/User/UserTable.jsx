import { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Popconfirm, message, notification } from 'antd';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import UserViewDetail from './UserViewDetail';
import { ExportOutlined, PlusOutlined, CloudDownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { render } from 'react-dom';

import './User.scss';
import UserModalCreate from './UserModalCreate';
import UserImport from './Data/UserImport';
import * as XLSX from 'xlsx';
import UserModalEdit from './UserModalEdit';

const UserTable = () => {
    const [form] = Form.useForm();
    const [listUser, setListUser] = useState([]);
    const [openUserViewDetail, setOpenUserViewDetail] = useState(false);
    const [openUserImport, setOpenUserImport] = useState(false);
    const [openUserEdit, setOpenUserEdit] = useState(false);
    const closeUserImport = () => {
        setOpenUserImport(false);
    };

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [viewDetailData, setViewDetailData] = useState({});
    const [dataUpdate, setDataUpdate] = useState({});

    const [tableFilter, setTableFilter] = useState('');
    const [tableSortQuery, setTableSortQuery] = useState('');

    const fetchUser = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (tableFilter) {
            query += tableFilter;
        }
        if (tableSortQuery) {
            query += `&${tableSortQuery}`;
        }
        setTableIsLoading(true);
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
            setTableIsLoading(false);
        }
    };

    const onClose = () => {
        setOpenUserViewDetail(false);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('>>> Check table sorter: ', sorter);
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
            // fetchUser()
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setTableSortQuery(q);
        }
    };

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchUser();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setOpenUserViewDetail(true);
                            setViewDetailData(record);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record, index) => {
                return (
                    <div className="user-table-action">
                        <Popconfirm
                            placement="leftTop"
                            title={'Xác nhận xóa user'}
                            description={' Bạn chắc chắn muốn xóa user này ?'}
                            onConfirm={() => {
                                handleDeleteUser(record._id);
                            }}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer', margin: '0 20px' }} />
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                console.log('>>> Check record: ', record);
                                setOpenUserEdit(true);
                                setDataUpdate(record);
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    const onFinishSearch = async (values) => {
        console.log('>>> Check Onfinish values: ', values);
        let query = '';
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`;
        }

        if (values.email) {
            query += `&email=/${values.email}/i`;
        }

        if (values.phone) {
            query += `&phone=/${values.phone}/i`;
        }

        if (query) {
            setTableFilter(query);
        }
    };

    const reloadTable = () => {
        setCurrent(1);
        setPageSize(5);
        fetchUser();
    };

    const RenderHeader = () => {
        const propFetchUser = fetchUser;
        const [openModal, setOpenModal] = useState(false);
        const toggleModal = () => {
            setOpenModal(false);
        };

        return (
            <div className="table-header">
                <div>Table List User</div>
                <div className="header-action">
                    <Button type="primary" onClick={() => handleExportData()}>
                        <ExportOutlined /> Export
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenUserImport(true);
                        }}
                    >
                        <CloudDownloadOutlined /> Import
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenModal(true);
                        }}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                    <Button type="primary" onClick={() => reloadTable()}>
                        <ReloadOutlined />
                    </Button>
                </div>
                <UserModalCreate openModal={openModal} toggleModal={toggleModal} />
                <UserImport open={openUserImport} onCancel={closeUserImport} fetchUser={propFetchUser} />
            </div>
        );
    };

    const handleExportData = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportUser.csv');
        }
    };

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, tableSortQuery, tableFilter]);

    return (
        <div className="user-table">
            <div className="table-filter">
                <Form
                    form={form}
                    name="add-new"
                    className="search-form"
                    initialValues={{
                        remember: false,
                    }}
                    onFinish={onFinishSearch}
                >
                    <div className="search-input">
                        <Form.Item name="fullName">
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item name="email">
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="phone">
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </div>
                    <div className="search-button">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Search
                            </Button>
                            <Button
                                className="login-form-button"
                                onClick={() => {
                                    setTableFilter('');
                                    form.resetFields();
                                    if (tableSortQuery) {
                                        setTableSortQuery('');
                                    }
                                }}
                            >
                                Clear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>

            <Table
                title={RenderHeader}
                dataSource={listUser}
                columns={columns}
                loading={tableIsLoading}
                rowKey="_id"
                onChange={onChange}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                Hàng {range[0]} - {range[1]} trên tổng số {total} hàng
                            </div>
                        );
                    },
                }}
            />
            <UserViewDetail open={openUserViewDetail} onClose={onClose} data={viewDetailData} fetchUser={fetchUser} />
            <UserModalEdit
                openModal={openUserEdit}
                toggleModal={() => setOpenUserEdit(false)}
                data={dataUpdate}
                fetchUser={fetchUser}
            />
        </div>
    );
};

export default UserTable;
