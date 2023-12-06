import { Table, Tag } from 'antd';
import { callOrderHistory } from '../../services/api';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

const columns = [
    {
        title: 'STT',
        dataIndex: 'stt',
        sorter: true,
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        sorter: true,
    },
    {
        title: 'Tổng số tiền',
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
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (text, record, index) => {
            return <Tag color="green">Thành công</Tag>;
        },
    },
    {
        title: 'Chi tiết',
        dataIndex: 'detailView',
        render: (text, record, index) => {
            return (
                <ReactJson
                    name="Chi tiết đơn mua"
                    src={record.detail}
                    displayDataTypes={false}
                    collapsed={false}
                    displayObjectSize={false}
                />
            );
        },
    },
];

const RenderHeader = () => <div style={{ fontWeight: 'bold', fontSize: '18px', opacity: 0.7 }}>Lịch sử mua hàng</div>;

const OrderHistory = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        const res = await callOrderHistory();
        if (res && res.data) {
            let data = res.data.map((item, index) => {
                item.stt = index + 1;
                return item;
            });
            setData(data);
        }
    };

    return (
        <div style={{ width: '1250px', maxWidth: 'calc(100% - 32px)', margin: '0 auto' }}>
            <Table title={RenderHeader} columns={columns} dataSource={data}></Table>
        </div>
    );
};
export default OrderHistory;
