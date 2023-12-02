import { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Upload, message, notification, Popover, Popconfirm } from 'antd';
import { DeleteTwoTone, EditTwoTone, LoadingOutlined } from '@ant-design/icons';
import { callDeleteBook, callFetchListBook } from '../../../services/api';

import { ExportOutlined, PlusOutlined, CloudDownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { render } from 'react-dom';

import './Book.scss';
import BookViewDetail from './BookViewDetail';
import BookModalAdd from './BookModalAdd';
import BookModalEdit from './BookModalEdit';
// import * as XLSX from 'xlsx';

const BookTable = () => {
    const [form] = Form.useForm();

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [tableFilter, setTableFilter] = useState('');
    const [tableSortQuery, setTableSortQuery] = useState('sort=-updatedAt');
    const [tableIsLoading, setTableIsLoading] = useState(false);

    const [viewDetailData, setViewDetailData] = useState({});
    const [dataBookEdit, setDataBookEdit] = useState({});
    const [openUserViewDetail, setOpenUserViewDetail] = useState(false);
    const [openBookEdit, setOpenBookEdit] = useState(false);

    const fetchBook = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (tableFilter) {
            query += tableFilter;
        }
        if (tableSortQuery) {
            query += `&${tableSortQuery}`;
        }
        const res = await callFetchListBook(query);
        setTableIsLoading(true);
        if (res?.data?.result && res.data.result.length > 0) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
            setTableIsLoading(false);
        }
    };

    const reloadTable = () => {
        setCurrent(1);
        setPageSize(5);
        fetchBook();
    };

    const onClose = () => {
        setOpenUserViewDetail(false);
        setViewDetailData(null);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
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
        const res = await callDeleteBook(userId);
        if (res && res.data) {
            message.success('Xóa sách thành công');
            fetchBook();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, tableFilter, tableSortQuery]);

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
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
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
                            okType="none"
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
                                setOpenBookEdit(true);
                                setDataBookEdit(record);
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
        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`;
        }

        if (values.author) {
            query += `&author=/${values.author}/i`;
        }

        if (values.category) {
            query += `&category=/${values.category}/i`;
        }

        if (query) {
            setTableFilter(() => {
                console.log('Check setTableFilter query: ', query);
                return query;
            });
        }
    };

    const RenderHeader = () => {
        const [openAddBookModal, setOpenAddBookModal] = useState(false);
        return (
            <div className="table-header">
                <div>Table List User</div>
                <div className="header-action">
                    <Button type="primary" onClick={() => handleExportBook()}>
                        <ExportOutlined /> Export (làm sau)
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenAddBookModal(true);
                        }}
                    >
                        <PlusOutlined /> Thêm mới
                    </Button>
                    <Button type="primary" onClick={() => reloadTable()}>
                        <ReloadOutlined />
                    </Button>
                </div>
                <BookModalAdd
                    openModal={openAddBookModal}
                    closeModal={() => setOpenAddBookModal(false)}
                    fetchBook={fetchBook}
                />
            </div>
        );
    };

    const handleExportBook = () => {
        // làm sau
        return;
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'ExportUser.csv');
        }
    };

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
                        <Form.Item name="mainText">
                            <Input placeholder="Tên sách" />
                        </Form.Item>
                        <Form.Item name="author">
                            <Input placeholder="Tác giả" />
                        </Form.Item>

                        <Form.Item name="category">
                            <Input placeholder="Thể loại" />
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
                                    // if (tableSortQuery !== 'sort=-updatedAt') {
                                    //     setTableSortQuery('sort=-updatedAt');
                                    // }
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
                dataSource={listBook}
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
            <BookViewDetail
                open={openUserViewDetail}
                onClose={onClose}
                data={viewDetailData}
                setViewDetailData={setViewDetailData}
            />
            <BookModalEdit
                openModal={openBookEdit}
                closeModal={() => setOpenBookEdit(false)}
                fetchBook={fetchBook}
                data={dataBookEdit}
            />
        </div>
    );
};

export default BookTable;
