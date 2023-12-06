import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { callFetchListOrder } from '../../../services/api';

import './Order.scss';

const OrderTable = () => {
    const [listOrder, setListOrder] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [tableSortQuery, setTableSortQuery] = useState('');

    const fetchOrder = async () => {
        let query = `current=${current}&pageSize=${pageSize}`;
        if (tableSortQuery) {
            query += `&${tableSortQuery}`;
        }
        setTableIsLoading(true);
        const res = await callFetchListOrder(query);
        console.log('>>> Check res.data: ', res.data);
        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total);
            setTableIsLoading(false);
        }
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
            title: 'Price',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <div>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(record.totalPrice)}
                    </div>
                );
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            sorter: true,
        },
    ];

    const reloadTable = () => {
        setCurrent(1);
        setPageSize(5);
        fetchUser();
    };

    const RenderHeader = () => (
        <div className="table-header">
            <div>Table List Order</div>
        </div>
    );

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, tableSortQuery]);

    return (
        <div className="user-table">
            <Table
                title={RenderHeader}
                dataSource={listOrder}
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
        </div>
    );
};

export default OrderTable;
